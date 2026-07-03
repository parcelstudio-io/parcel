import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { completeAgentResponse } from "@/lib/agent/prompt-builder";
import { extractMemoryUpdates } from "@/lib/agent/memory";
import { transcribeAudio, synthesizeSpeech } from "@/lib/voice/csm-client";
import { getVoiceSession } from "@/lib/voice/session-context";
import type { AgentMemory, ChatMessage } from "@/types/database";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob;
    const sessionId = (formData.get("session_id") as string) || user.id;

    if (!audio) return NextResponse.json({ error: "No audio provided" }, { status: 400 });

    const transcript = await transcribeAudio(audio);

    const supabase = await createClient();
    const { data: agent } = await supabase.from("agents").select("*").eq("user_id", user.id).single();
    const memory = (agent?.memory as AgentMemory) || { facts: [], preferences: {} };

    const { data: historyRows } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(20);

    const history: ChatMessage[] = (historyRows || []).map((r) => ({
      role: r.role as "user" | "assistant",
      content: r.content,
    }));
    history.push({ role: "user", content: transcript });

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "user", content: transcript });

    const reply = await completeAgentResponse({
      userId: user.id,
      memory,
      history,
      systemOverride: agent?.system_instruction_override,
      developerOverride: agent?.developer_instruction_override,
      llmProvider: agent?.llm_provider,
      llmModel: agent?.llm_model,
    });

    await supabase.from("chat_messages").insert({ user_id: user.id, role: "assistant", content: reply });

    const updatedMemory = await extractMemoryUpdates(transcript, reply, memory);
    await supabase.from("agents").update({ memory: updatedMemory, updated_at: new Date().toISOString() }).eq("user_id", user.id);

    const voiceSession = getVoiceSession(sessionId);
    const context = voiceSession.getContext();

    let audioBase64: string | undefined;
    let audioUrl: string | undefined;

    try {
      const audioBuffer = await synthesizeSpeech(reply, 1, context);
      audioBase64 = Buffer.from(audioBuffer).toString("base64");
      audioUrl = `data:audio/wav;base64,${audioBase64}`;
      voiceSession.addUserTurn(transcript);
      voiceSession.addAgentTurn(reply, audioBase64);
    } catch {
      // CSM service unavailable — return text-only
    }

    return NextResponse.json({ transcript, reply, audio_url: audioUrl, audio_base64: audioBase64 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Voice chat failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
