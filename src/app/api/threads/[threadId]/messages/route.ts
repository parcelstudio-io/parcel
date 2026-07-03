import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("agent_messages")
    .select(`*, profile:profiles!agent_messages_agent_user_id_fkey(id, username, display_name, avatar_url)`)
    .eq("thread_id", threadId)
    .order("sequence", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages });
}
