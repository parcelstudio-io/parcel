import type { ChatMessage, AgentMemory } from "@/types/database";
import { loadInstructions, formatMemoryForPrompt } from "@/lib/instructions/load";
import { createLLMProvider } from "@/lib/agent/llm-router";

export interface PromptContext {
  userId: string;
  memory: AgentMemory;
  history: ChatMessage[];
  systemOverride?: string | null;
  developerOverride?: string | null;
  llmProvider?: string | null;
  llmModel?: string | null;
}

export async function buildMessages(ctx: PromptContext): Promise<ChatMessage[]> {
  const instructions = await loadInstructions(ctx.userId, {
    system: ctx.systemOverride,
    developer: ctx.developerOverride,
  });

  const memoryBlock = formatMemoryForPrompt(ctx.memory);
  const systemContent = [
    instructions.system,
    memoryBlock ? `\n---\n${memoryBlock}` : "",
    `\n---\n${instructions.developer}`,
  ]
    .filter(Boolean)
    .join("");

  return [
    { role: "system", content: systemContent },
    ...ctx.history.filter((m) => m.role !== "system"),
  ];
}

export async function streamAgentResponse(ctx: PromptContext) {
  const messages = await buildMessages(ctx);
  const provider = createLLMProvider({
    provider: (ctx.llmProvider as "openai" | "ollama") || undefined,
    model: ctx.llmModel || undefined,
  });
  return provider.streamChat(messages);
}

export async function completeAgentResponse(ctx: PromptContext): Promise<string> {
  const messages = await buildMessages(ctx);
  const provider = createLLMProvider({
    provider: (ctx.llmProvider as "openai" | "ollama") || undefined,
    model: ctx.llmModel || undefined,
  });
  return provider.complete(messages);
}
