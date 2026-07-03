"""
CSM generator wrapper.
In production, clone https://github.com/SesameAILabs/csm and use their generator.py.
This module provides a compatible interface that falls back gracefully.
"""
import os


class Segment:
    def __init__(self, text: str, speaker: int, audio=None):
        self.text = text
        self.speaker = speaker
        self.audio = audio


class MockCSMGenerator:
    sample_rate = 24000

    def generate(self, text: str, speaker: int, context: list, max_audio_length_ms: int = 10000):
        import torch
        duration = min(len(text) * 0.05, max_audio_length_ms / 1000)
        num_samples = int(self.sample_rate * duration)
        return torch.zeros(num_samples)


def load_csm_1b(device: str = "cpu"):
    """Load CSM-1B model. Requires SesameAILabs/csm repo files."""
    try:
        # Attempt to use real CSM if installed alongside this service
        from transformers import CsmForConditionalGeneration, AutoProcessor
        import torch

        model_id = os.getenv("CSM_MODEL", "sesame/csm-1b")

        class TransformersCSMGenerator:
            sample_rate = 24000

            def __init__(self):
                self.processor = AutoProcessor.from_pretrained(model_id)
                self.model = CsmForConditionalGeneration.from_pretrained(model_id, device_map=device)

            def generate(self, text: str, speaker: int, context: list, max_audio_length_ms: int = 10000):
                conversation = [{"role": str(speaker), "content": [{"type": "text", "text": text}]}]
                inputs = self.processor.apply_chat_template(conversation, tokenize=True, return_dict=True)
                inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
                audio = self.model.generate(**inputs, output_audio=True)
                return audio.squeeze()

        return TransformersCSMGenerator()
    except Exception as e:
        print(f"Could not load real CSM model: {e}. Using mock generator.")
        return MockCSMGenerator()
