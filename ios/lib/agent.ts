import type { ChatMessage } from "./types";

export type AgentChatMessage = Pick<ChatMessage, "role" | "content">;

const API_URL =
  process.env.EXPO_PUBLIC_AGENT_API_URL ?? "http://localhost:3000/api/agent/chat";

const OLLAMA_HOST = process.env.EXPO_PUBLIC_OLLAMA_HOST;
const OLLAMA_MODEL = process.env.EXPO_PUBLIC_OLLAMA_MODEL ?? "for/gemma3-thinking";

function toOllamaRole(role: ChatMessage["role"]): "user" | "assistant" | "system" {
  return role === "agent" ? "assistant" : "user";
}

const SYSTEM_PROMPT = `You are Aria, a warm and thoughtful personal agent for Parcel. Your job is to learn about the user — their interests, goals, routines, and values — so you can represent them well when connecting with other people.

Keep replies concise (1–3 short paragraphs). Be curious, friendly, and natural. Ask one follow-up question when it helps you learn more. Do not mention being an AI or a language model.`;

async function chatDirectOllama(history: AgentChatMessage[]): Promise<string> {
  if (!OLLAMA_HOST) {
    throw new Error("Set EXPO_PUBLIC_OLLAMA_HOST or EXPO_PUBLIC_AGENT_API_URL");
  }

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: toOllamaRole(m.role),
      content: m.content,
    })),
  ];

  const request = async (think: boolean): Promise<string> => {
    const body: Record<string, unknown> = {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    };
    if (think) body.think = true;

    const res = await fetch(`${OLLAMA_HOST.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      error?: string;
      message?: { content?: string; thinking?: string };
    };

    if (data.error) {
      if (think && /does not support thinking/i.test(data.error)) {
        return request(false);
      }
      throw new Error(data.error);
    }

    return (
      data.message?.content?.trim() ||
      data.message?.thinking?.trim() ||
      "Sorry, I couldn't generate a reply."
    );
  };

  return request(true);
}

async function chatViaApi(history: AgentChatMessage[]): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history }),
  });

  const data = (await res.json()) as { reply?: string; error?: string };

  if (!res.ok || data.error) {
    throw new Error(data.error ?? `Agent API error (${res.status})`);
  }

  return data.reply ?? "Sorry, I couldn't generate a reply.";
}

export async function sendAgentMessage(history: AgentChatMessage[]): Promise<string> {
  if (OLLAMA_HOST) {
    return chatDirectOllama(history);
  }
  return chatViaApi(history);
}
