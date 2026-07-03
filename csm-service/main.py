"""
Sesame CSM Voice Service
Wraps SesameAILabs/csm for conversational speech synthesis + Whisper STT.
https://github.com/SesameAILabs/csm
"""
import io
import os
import base64
import tempfile
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
CSM_MODEL = os.getenv("CSM_MODEL", "sesame/csm-1b")
USE_MOCK = os.getenv("CSM_MOCK", "true").lower() == "true"

whisper_model = None
csm_generator = None


class VoiceSegment(BaseModel):
    speaker: int
    text: str
    audio_base64: Optional[str] = None


class SynthesizeRequest(BaseModel):
    text: str
    speaker_id: int = 1
    context: list[VoiceSegment] = []


def load_models():
    global whisper_model, csm_generator

    if USE_MOCK:
        print("CSM service running in MOCK mode (set CSM_MOCK=false for real models)")
        return

    try:
        from faster_whisper import WhisperModel
        whisper_model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        print(f"Loaded Whisper model: {WHISPER_MODEL}")
    except Exception as e:
        print(f"Whisper load failed, using mock STT: {e}")

    try:
        from generator import load_csm_1b, Segment
        import torch
        device = "cuda" if torch.cuda.is_available() else "cpu"
        csm_generator = load_csm_1b(device=device)
        print(f"Loaded CSM model on {device}")
    except Exception as e:
        print(f"CSM load failed, using mock TTS: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield


app = FastAPI(title="CSM Voice Service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "mock_mode": USE_MOCK or csm_generator is None,
        "whisper_loaded": whisper_model is not None or USE_MOCK,
        "csm_loaded": csm_generator is not None or USE_MOCK,
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    if whisper_model is not None and not USE_MOCK:
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=True) as tmp:
            tmp.write(audio_bytes)
            tmp.flush()
            segments, _ = whisper_model.transcribe(tmp.name)
            text = " ".join(s.text for s in segments).strip()
            return {"text": text}

    # Mock STT for development without Whisper installed
    return {"text": "[Voice input — connect Whisper or disable mock mode for real transcription]"}


@app.post("/synthesize")
async def synthesize(request: SynthesizeRequest):
    if csm_generator is not None and not USE_MOCK:
        try:
            from generator import Segment
            import torchaudio
            import torch

            context_segments = []
            for seg in request.context:
                audio_tensor = None
                if seg.audio_base64:
                    audio_bytes = base64.b64decode(seg.audio_base64)
                    with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmp:
                        tmp.write(audio_bytes)
                        tmp.flush()
                        audio_tensor, sr = torchaudio.load(tmp.name)
                        audio_tensor = torchaudio.functional.resample(
                            audio_tensor.squeeze(0),
                            orig_freq=sr,
                            new_freq=csm_generator.sample_rate,
                        )
                context_segments.append(
                    Segment(text=seg.text, speaker=seg.speaker, audio=audio_tensor)
                )

            audio = csm_generator.generate(
                text=request.text,
                speaker=request.speaker_id,
                context=context_segments,
                max_audio_length_ms=30_000,
            )

            buffer = io.BytesIO()
            torchaudio.save(buffer, audio.unsqueeze(0).cpu(), csm_generator.sample_rate, format="wav")
            return Response(content=buffer.getvalue(), media_type="audio/wav")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Mock TTS: generate a minimal valid WAV silence
    return Response(content=_generate_mock_wav(), media_type="audio/wav")


def _generate_mock_wav(duration_ms: int = 500) -> bytes:
    """Generate a minimal WAV file (silence) for mock mode."""
    import struct
    sample_rate = 24000
    num_samples = int(sample_rate * duration_ms / 1000)
    data_size = num_samples * 2
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        36 + data_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        1,
        sample_rate,
        sample_rate * 2,
        2,
        16,
        b"data",
        data_size,
    )
    return header + b"\x00" * data_size


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8001")))
