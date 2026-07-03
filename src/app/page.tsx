"use client";

import { useState, useEffect, useCallback } from "react";
import { PostGrid } from "@/components/home/post-grid";
import { CreatePostForm } from "@/components/home/create-post-form";
import type { Post, PostType } from "@/types/database";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostType | "all">("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadPosts = useCallback(async () => {
    const url = filter === "all" ? "/api/posts" : `/api/posts?type=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      loadPosts();
    }
    checkAuth();
  }, [loadPosts, router]);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home</h1>
        <div className="flex gap-2">
          {(["all", "photo", "video", "writing"] as const).map((t) => (
            <Button
              key={t}
              variant={filter === t ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(t); setLoading(true); }}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <CreatePostForm onCreated={loadPosts} />

      {loading ? (
        <p className="text-center text-neutral-500 py-12">Loading posts...</p>
      ) : (
        <PostGrid posts={posts} />
      )}
    </div>
  );
}
