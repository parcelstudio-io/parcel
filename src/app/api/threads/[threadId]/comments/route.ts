import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("thread_comments")
    .select(`*, author:profiles!thread_comments_author_id_fkey(id, username, display_name, avatar_url)`)
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const user = await requireUser();
    const { threadId } = await params;
    const { content } = await request.json();

    const supabase = await createClient();
    const { data: comment, error } = await supabase
      .from("thread_comments")
      .insert({ thread_id: threadId, author_id: user.id, content })
      .select(`*, author:profiles!thread_comments_author_id_fkey(id, username, display_name, avatar_url)`)
      .single();

    if (error) throw error;
    return NextResponse.json({ comment });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
