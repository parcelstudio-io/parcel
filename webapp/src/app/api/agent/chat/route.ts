import { NextResponse } from "next/server";
import { sendAgentMessage, type AgentChatMessage } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: AgentChatMessage[] };

    if (!body.messages?.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const reply = await sendAgentMessage(body.messages);
    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Agent request failed";
    console.error("[agent/chat]", message);
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
