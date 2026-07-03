"use client";

import Link from "next/link";
import Masonry from "react-masonry-css";
import type { Post } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const breakpointColumns = { default: 4, 1100: 3, 700: 2, 500: 1 };

export function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <p className="text-lg">No posts yet</p>
        <p className="text-sm">Share a photo, video, or writing to get started</p>
      </div>
    );
  }

  return (
    <Masonry breakpointCols={breakpointColumns} className="flex w-auto gap-4" columnClassName="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Masonry>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/home/${post.id}`} className="block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
      {post.type === "photo" && post.media_url && (
        <img src={post.media_url} alt={post.caption ?? ""} className="w-full object-cover" />
      )}
      {post.type === "video" && post.media_url && (
        <video src={post.media_url} className="w-full" muted />
      )}
      {post.type === "writing" && (
        <div className={cn("p-4", "min-h-[120px]")}>
          <p className="line-clamp-6 text-sm leading-relaxed whitespace-pre-wrap">{post.body}</p>
        </div>
      )}
      <div className="flex items-center justify-between p-3">
        <Badge className="capitalize bg-neutral-100 dark:bg-neutral-800">{post.type}</Badge>
        <span className="text-xs text-neutral-500">{post.like_count ?? 0} likes</span>
      </div>
      {post.caption && post.type !== "writing" && (
        <p className="px-3 pb-3 text-sm text-neutral-600 line-clamp-2">{post.caption}</p>
      )}
    </Link>
  );
}
