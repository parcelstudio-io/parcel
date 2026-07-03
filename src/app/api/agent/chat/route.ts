import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { streamAgentResponse } from "@/lib/agent/prompt-builder";
import { extractMemoryUpdates } from "@/lib/agent/memory";
import type { AgentMemory, ChatMessage } from "@/types/database";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { message, history = [] } = await request.json();

    const supabase = await createClient();
    const { data: agent } = await supabase.from("agents").select("*").eq("user_id", user.id).single();
    const agentRow = agent as { memory?: AgentMemory; system_instruction_override?: string | null; developer_instruction_override?: string | null; llm_provider?: string | null; llm_model?: string | null } | null;

    const memory = agentRow?.memory || { facts: [], preferences: {} };
    const chatHistory: ChatMessage[] = [
      ...history.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: message });

    const stream = await streamAgentResponse({
      userId: user.id,
      memory,
      history: chatHistory,
      systemOverride: agentRow?.system_instruction_override,
      developerOverride: agentRow?.developer_instruction_override,
      llmProvider: agentRow?.llm_provider,
      llmModel: agentRow?.llm_model,
    });

    let fullResponse = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();

          await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: fullResponse });

          const updatedMemory = await extractMemoryUpdates(message, fullResponse, memory);
          await supabase.from("agents").update({ memory: updatedMemory, updated_at: new Date().toISOString() }).eq("user_id", user.id);
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Transfer-Encoding": "chunked" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
