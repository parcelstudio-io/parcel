import type { ChatMessage } from "@/types/database";

export interface StreamOptions {
  model?: string;
  temperature?: number;
}

export interface LLMProvider {
  id: "openai" | "ollama";
  streamChat(messages: ChatMessage[], options?: StreamOptions): AsyncIterable<string>;
  complete(messages: ChatMessage[]): Promise<string>;
}

export interface LLMConfig {
  provider: "openai" | "ollama";
  model: string;
}

export function getDefaultLLMConfig(): LLMConfig {
  return {
    provider: (process.env.LLM_PROVIDER as "openai" | "ollama") || "ollama",
    model: process.env.LLM_MODEL || process.env.OLLAMA_MODEL || "gemma4",
  };
}
