import { OpenAIProvider } from "./providers/openai";
import { OllamaProvider } from "./providers/ollama";
import type { LLMConfig, LLMProvider } from "./providers/types";

export function createLLMProvider(config?: Partial<LLMConfig>): LLMProvider {
  const provider = config?.provider || (process.env.LLM_PROVIDER as "openai" | "ollama") || "ollama";
  const model = config?.model || process.env.LLM_MODEL || process.env.OLLAMA_MODEL || "gemma4";

  if (provider === "openai") {
    return new OpenAIProvider(process.env.OPENAI_API_KEY, model);
  }
  return new OllamaProvider(process.env.OLLAMA_BASE_URL, model);
}

export { getDefaultLLMConfig } from "./providers/types";
