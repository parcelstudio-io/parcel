import { chatWithOllama, type AgentChatMessage } from "./ollama";

export type { AgentChatMessage };

export async function sendAgentMessage(history: AgentChatMessage[]): Promise<string> {
  const host = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "for/gemma3-thinking";

  return chatWithOllama(host, model, history);
}
