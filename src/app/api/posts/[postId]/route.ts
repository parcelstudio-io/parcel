import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`*, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)`)
    .eq("id", postId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: comments } = await supabase
    .from("post_comments")
    .select(`*, author:profiles!post_comments_author_id_fkey(id, username, display_name, avatar_url)`)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const { count: likeCount } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  const { data: { user } } = await supabase.auth.getUser();
  let likedByUser = false;
  if (user) {
    const { data: like } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();
    likedByUser = !!like;
  }

  return NextResponse.json({ post: { ...post, like_count: likeCount ?? 0, liked_by_user: likedByUser }, comments: comments ?? [] });
}

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const user = await requireUser();
    const { postId } = await params;
    const { action, content } = await request.json();
    const supabase = await createClient();

    if (action === "like") {
      const { data: existing } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("post_likes").delete().eq("id", existing.id);
        return NextResponse.json({ liked: false });
      }
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
      return NextResponse.json({ liked: true });
    }

    if (action === "comment" && content) {
      const { data: comment, error } = await supabase
        .from("post_comments")
        .insert({ post_id: postId, author_id: user.id, content })
        .select(`*, author:profiles!post_comments_author_id_fkey(id, username, display_name, avatar_url)`)
        .single();
      if (error) throw error;
      return NextResponse.json({ comment });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
