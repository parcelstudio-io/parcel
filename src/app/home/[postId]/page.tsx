"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Post, PostComment } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [comment, setComment] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { postId } = await params;
      const res = await fetch(`/api/posts/${postId}`);
      const data = await res.json();
      setPost(data.post);
      setComments(data.comments || []);
    }
    load();
  }, [params, router]);

  async function toggleLike() {
    if (!post) return;
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    });
    const data = await res.json();
    setPost((prev) =>
      prev
        ? {
            ...prev,
            liked_by_user: data.liked,
            like_count: (prev.like_count ?? 0) + (data.liked ? 1 : -1),
          }
        : null
    );
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!post || !comment.trim()) return;
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", content: comment }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setComment("");
    }
  }

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </Link>

      {post.type === "photo" && post.media_url && (
        <img src={post.media_url} alt={post.caption ?? ""} className="w-full rounded-xl" />
      )}
      {post.type === "video" && post.media_url && (
        <video src={post.media_url} controls className="w-full rounded-xl" />
      )}
      {post.type === "writing" && (
        <div className="prose dark:prose-invert whitespace-pre-wrap rounded-xl border p-6">
          {post.body}
        </div>
      )}

      {post.caption && <p className="mt-4 text-lg">{post.caption}</p>}

      <div className="mt-4 flex items-center gap-4">
        <Button variant="ghost" onClick={toggleLike} className={post.liked_by_user ? "text-red-500" : ""}>
          <Heart className={`mr-1 h-5 w-5 ${post.liked_by_user ? "fill-current" : ""}`} />
          {post.like_count ?? 0}
        </Button>
        <span className="text-sm text-neutral-500">by {post.author?.username}</span>
      </div>

      <div className="mt-8 border-t pt-4">
        <h2 className="mb-4 font-semibold">Comments</h2>
        {comments.map((c) => (
          <div key={c.id} className="mb-2 text-sm">
            <span className="font-medium">{c.author?.username}</span>: {c.content}
          </div>
        ))}
        <form onSubmit={submitComment} className="mt-4 flex gap-2">
          <Input placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button type="submit">Post</Button>
        </form>
      </div>
    </div>
  );
}
