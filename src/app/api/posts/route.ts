import { NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("author_id");
  const type = searchParams.get("type");

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(`*, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)`)
    .order("created_at", { ascending: false });

  if (authorId) query = query.eq("author_id", authorId);
  if (type) query = query.eq("type", type);

  const { data: posts, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { user } } = await supabase.auth.getUser();

  const enriched = await Promise.all(
    (posts || []).map(async (post) => {
      const { count: likeCount } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      const { count: commentCount } = await supabase
        .from("post_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      let likedByUser = false;
      if (user) {
        const { data: like } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();
        likedByUser = !!like;
      }

      return { ...post, like_count: likeCount ?? 0, comment_count: commentCount ?? 0, liked_by_user: likedByUser };
    })
  );

  return NextResponse.json({ posts: enriched });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const caption = formData.get("caption") as string;
    const body = formData.get("body") as string | null;
    const file = formData.get("file") as File | null;

    let mediaUrl: string | null = null;

    if (file && type !== "writing") {
      const supabase = await createClient();
      const ext = file.name.split(".").pop() || "bin";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      mediaUrl = publicUrl;
    }

    const supabase = await createClient();
    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        author_id: user.id,
        type: type as "photo" | "video" | "writing",
        caption: caption || null,
        body: type === "writing" ? body : null,
        media_url: mediaUrl,
      })
      .select(`*, author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)`)
      .single();

    if (error) throw error;
    return NextResponse.json({ post });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
