import type { ChatMessage } from "./types";

const SYSTEM_PROMPT = `You are Aria, a warm and thoughtful personal agent for Parcel. Your job is to learn about the user — their interests, goals, routines, and values — so you can represent them well when connecting with other people.

Keep replies concise (1–3 short paragraphs). Be curious, friendly, and natural. Ask one follow-up question when it helps you learn more. Do not mention being an AI or a language model.`;

export type AgentChatMessage = Pick<ChatMessage, "role" | "content">;

function toOllamaRole(role: ChatMessage["role"]): "user" | "assistant" | "system" {
  return role === "agent" ? "assistant" : "user";
}

export function buildOllamaMessages(history: AgentChatMessage[]) {
  return [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: toOllamaRole(m.role),
      content: m.content,
    })),
  ];
}

export async function chatWithOllama(
  host: string,
  model: string,
  history: AgentChatMessage[],
  options?: { think?: boolean }
): Promise<string> {
  const think = options?.think ?? true;
  const messages = buildOllamaMessages(history);

  const request = async (withThink: boolean) => {
    const body: Record<string, unknown> = { model, messages, stream: false };
    if (withThink) body.think = true;

    const res = await fetch(`${host.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      error?: string;
      message?: { content?: string; thinking?: string };
    };

    if (data.error) {
      if (withThink && /does not support thinking/i.test(data.error)) {
        return request(false);
      }
      throw new Error(data.error);
    }

    const content = data.message?.content?.trim();
    if (content) return content;

    const thinking = data.message?.thinking?.trim();
    if (thinking) return thinking;

    throw new Error("Empty response from model");
  };

  return request(think);
}
