import type { VoiceSegment } from "@/types/database";

const CSM_SERVICE_URL = process.env.CSM_SERVICE_URL || "http://localhost:8001";

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");

  const response = await fetch(`${CSM_SERVICE_URL}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status}`);
  }

  const data = await response.json();
  return data.text || "";
}

export async function synthesizeSpeech(
  text: string,
  speakerId: number,
  context: VoiceSegment[] = []
): Promise<ArrayBuffer> {
  const response = await fetch(`${CSM_SERVICE_URL}/synthesize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, speaker_id: speakerId, context }),
  });

  if (!response.ok) {
    throw new Error(`Synthesis failed: ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function checkCSMHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CSM_SERVICE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}
