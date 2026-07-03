import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: conversationId } = await params;
    const supabase = await createClient();

    const { data: participation } = await supabase
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!participation) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: messages, error } = await supabase
      .from("direct_messages")
      .select(`*, sender:profiles!direct_messages_sender_id_fkey(id, username, display_name, avatar_url)`)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const { data: participants } = await supabase
      .from("conversation_participants")
      .select(`profile:profiles!conversation_participants_user_id_fkey(id, username, display_name, avatar_url)`)
      .eq("conversation_id", conversationId)
      .neq("user_id", user.id);

    return NextResponse.json({
      messages,
      other_user: participants?.[0]?.profile,
      current_user_id: user.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: conversationId } = await params;
    const { content } = await request.json();
    const supabase = await createClient();

    const { data: message, error } = await supabase
      .from("direct_messages")
      .insert({ conversation_id: conversationId, sender_id: user.id, content })
      .select(`*, sender:profiles!direct_messages_sender_id_fkey(id, username, display_name, avatar_url)`)
      .single();

    if (error) throw error;

    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);

    return NextResponse.json({ message });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
