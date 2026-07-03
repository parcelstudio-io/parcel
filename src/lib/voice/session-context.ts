import type { VoiceSegment } from "@/types/database";

const MAX_CONTEXT_TURNS = 6;

export class VoiceSessionContext {
  private segments: VoiceSegment[] = [];

  addUserTurn(text: string, audioBase64?: string) {
    this.segments.push({ speaker: 0, text, audio_base64: audioBase64 });
    this.trim();
  }

  addAgentTurn(text: string, audioBase64?: string) {
    this.segments.push({ speaker: 1, text, audio_base64: audioBase64 });
    this.trim();
  }

  getContext(): VoiceSegment[] {
    return [...this.segments];
  }

  clear() {
    this.segments = [];
  }

  private trim() {
    if (this.segments.length > MAX_CONTEXT_TURNS) {
      this.segments = this.segments.slice(-MAX_CONTEXT_TURNS);
    }
  }
}

const sessions = new Map<string, VoiceSessionContext>();

export function getVoiceSession(sessionId: string): VoiceSessionContext {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new VoiceSessionContext());
  }
  return sessions.get(sessionId)!;
}
