import type { AgentMemory } from "@/types/database";
import { completeAgentResponse } from "./prompt-builder";

const MEMORY_EXTRACTION_PROMPT = `Extract durable facts and preferences from this conversation turn.
Return JSON only: {"facts":["..."], "preferences":{"key":"value"}}
Only include new or updated information. Keep facts concise.`;

export async function extractMemoryUpdates(
  userMessage: string,
  assistantMessage: string,
  existingMemory: AgentMemory
): Promise<AgentMemory> {
  try {
    const response = await completeAgentResponse({
      userId: "system",
      memory: { facts: [], preferences: {} },
      history: [
        { role: "system", content: MEMORY_EXTRACTION_PROMPT },
        {
          role: "user",
          content: `Existing memory: ${JSON.stringify(existingMemory)}\n\nUser: ${userMessage}\nAssistant: ${assistantMessage}`,
        },
      ],
    });

    const match = response.match(/\{[\s\S]*\}/);
    if (!match) return existingMemory;

    const parsed = JSON.parse(match[0]) as { facts?: string[]; preferences?: Record<string, string> };
    const newFacts = parsed.facts || [];
    const mergedFacts = [...new Set([...(existingMemory.facts || []), ...newFacts])].slice(-50);

    return {
      facts: mergedFacts,
      preferences: { ...(existingMemory.preferences || {}), ...(parsed.preferences || {}) },
      last_updated: new Date().toISOString(),
    };
  } catch {
    return existingMemory;
  }
}

export function mergeMemory(existing: AgentMemory, updates: AgentMemory): AgentMemory {
  return {
    facts: [...new Set([...(existing.facts || []), ...(updates.facts || [])])].slice(-50),
    preferences: { ...(existing.preferences || {}), ...(updates.preferences || {}) },
    last_updated: new Date().toISOString(),
  };
}
