import OpenAI from "openai";
import type { ChatMessage } from "@/types/database";
import type { LLMProvider, StreamOptions } from "./types";

export class OpenAIProvider implements LLMProvider {
  id = "openai" as const;
  private client: OpenAI;
  private defaultModel: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
    this.defaultModel = model || process.env.OPENAI_MODEL || "gpt-4o";
  }

  async *streamChat(messages: ChatMessage[], options?: StreamOptions): AsyncIterable<string> {
    const stream = await this.client.chat.completions.create({
      model: options?.model || this.defaultModel,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      temperature: options?.temperature ?? 0.7,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
    }
  }

  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.defaultModel,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content ?? "";
  }
}
