import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    const conversationIds = participations?.map((p) => p.conversation_id) ?? [];
    if (conversationIds.length === 0) return NextResponse.json({ conversations: [] });

    const conversations = await Promise.all(
      conversationIds.map(async (convId) => {
        const { data: participants } = await supabase
          .from("conversation_participants")
          .select(`user_id, profile:profiles!conversation_participants_user_id_fkey(id, username, display_name, avatar_url)`)
          .eq("conversation_id", convId);

        const other = participants?.find((p) => p.user_id !== user.id);

        const { data: lastMessage } = await supabase
          .from("direct_messages")
          .select("*")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: convId,
          other_user: other?.profile,
          last_message: lastMessage,
          updated_at: lastMessage?.created_at ?? new Date().toISOString(),
        };
      })
    );

    conversations.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json({ conversations });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { username } = await request.json();
    const supabase = await createClient();

    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!targetProfile) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (targetProfile.id === user.id) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });

    const { data: myConvs } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    for (const conv of myConvs ?? []) {
      const { data: participants } = await supabase
        .from("conversation_participants")
        .select("user_id")
        .eq("conversation_id", conv.conversation_id);

      const userIds = participants?.map((p) => p.user_id) ?? [];
      if (userIds.includes(targetProfile.id) && userIds.length === 2) {
        return NextResponse.json({ conversation_id: conv.conversation_id });
      }
    }

    const { data: conversation } = await supabase.from("conversations").insert({}).select().single();
    if (!conversation) throw new Error("Failed to create conversation");

    await supabase.from("conversation_participants").insert([
      { conversation_id: conversation.id, user_id: user.id },
      { conversation_id: conversation.id, user_id: targetProfile.id },
    ]);

    return NextResponse.json({ conversation_id: conversation.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
