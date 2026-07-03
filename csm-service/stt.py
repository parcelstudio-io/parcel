"""Whisper STT module — used via faster-whisper in main.py"""

WHISPER_AVAILABLE = False

try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except ImportError:
    pass
