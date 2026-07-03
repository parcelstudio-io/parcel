import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { completeAgentResponse } from "@/lib/agent/prompt-builder";
import { loadInstructions } from "@/lib/instructions/load";
import type { AgentMemory, ChatMessage } from "@/types/database";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { target_user_id } = await request.json();

    if (!target_user_id || target_user_id === user.id) {
      return NextResponse.json({ error: "Invalid target user" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: agents } = await supabase
      .from("agents")
      .select("*, profiles!agents_user_id_fkey(username, display_name)")
      .in("user_id", [user.id, target_user_id]);

    const agentA = agents?.find((a) => a.user_id === user.id);
    const agentB = agents?.find((a) => a.user_id === target_user_id);

    if (!agentA || !agentB) {
      return NextResponse.json({ error: "Agents not found" }, { status: 404 });
    }

    const { data: thread } = await supabase
      .from("agent_threads")
      .insert({ user_a_id: user.id, user_b_id: target_user_id, title: "Agent conversation", summary: "" })
      .select()
      .single();

    if (!thread) return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });

    const instructionsA = await loadInstructions(user.id, {
      system: agentA.system_instruction_override,
      developer: agentA.developer_instruction_override,
    });
    const instructionsB = await loadInstructions(target_user_id, {
      system: agentB.system_instruction_override,
      developer: agentB.developer_instruction_override,
    });

    const memoryA = (agentA.memory as AgentMemory) || { facts: [], preferences: {} };
    const memoryB = (agentB.memory as AgentMemory) || { facts: [], preferences: {} };

    const turns = 8;
    const dialogueMessages: { userId: string; content: string }[] = [];
    let currentSpeaker = user.id;
    let lastMessage = "Hello! I'd like to introduce my user and learn about yours.";

    for (let i = 0; i < turns; i++) {
      const isA = currentSpeaker === user.id;
      const speakerMemory = isA ? memoryA : memoryB;
      const otherMemory = isA ? memoryB : memoryA;
      const speakerInstructions = isA ? instructionsA : instructionsB;

      const history: ChatMessage[] = dialogueMessages.map((m) => ({
        role: m.userId === currentSpeaker ? "assistant" : "user",
        content: m.content,
      }));

      if (lastMessage) history.push({ role: "user", content: lastMessage });

      const response = await completeAgentResponse({
        userId: currentSpeaker,
        memory: speakerMemory,
        history: [
          {
            role: "system",
            content: `${speakerInstructions.system}\n\nYou are in an agent-to-agent dialogue. Share appropriate info about your user. Other agent knows: ${JSON.stringify(otherMemory.facts?.slice(0, 5) || [])}`,
          },
          ...history.filter((h) => h.role !== "system"),
        ],
        llmProvider: isA ? agentA.llm_provider : agentB.llm_provider,
        llmModel: isA ? agentA.llm_model : agentB.llm_model,
      });

      dialogueMessages.push({ userId: currentSpeaker, content: response });
      lastMessage = response;
      currentSpeaker = currentSpeaker === user.id ? target_user_id : user.id;

      await supabase.from("agent_messages").insert({
        thread_id: thread.id,
        agent_user_id: dialogueMessages[dialogueMessages.length - 1].userId === user.id ? user.id : target_user_id,
        role: "agent",
        content: response,
        sequence: i,
      });
    }

    const summaryPrompt: ChatMessage[] = [
      { role: "system", content: "Summarize this agent dialogue. Return JSON: {\"title\":\"...\",\"summary\":\"...\"}" },
      { role: "user", content: dialogueMessages.map((m) => m.content).join("\n\n") },
    ];

    const summaryRaw = await completeAgentResponse({
      userId: user.id,
      memory: { facts: [], preferences: {} },
      history: summaryPrompt,
    });

    let title = "Agent Conversation";
    let summary = dialogueMessages[0]?.content.slice(0, 200) ?? "";

    try {
      const match = summaryRaw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        title = parsed.title || title;
        summary = parsed.summary || summary;
      }
    } catch {
      // use defaults
    }

    await supabase.from("agent_threads").update({ title, summary }).eq("id", thread.id);

    return NextResponse.json({ thread_id: thread.id, title, summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Dialogue failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
