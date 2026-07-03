"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Play, PenLine } from "lucide-react";
import type { Post } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type PostDetailProps = {
  post: Post;
};

export function PostDetail({ post }: PostDetailProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: `pc-${Date.now()}`,
        author: currentUser,
        content: comment.trim(),
        timestamp: "Just now",
      },
    ]);
    setComment("");
  };

  return (
    <div className="animate-fade-in">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {post.type === "writing" ? (
          <div className="bg-gradient-to-br from-stone-50 to-white px-8 py-10">
            <PenLine className="mb-4 h-6 w-6 text-stone-400" />
            <h1 className="mb-6 text-2xl font-bold">{post.title}</h1>
            <div className="prose prose-stone max-w-none">
              {post.writingContent?.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 leading-relaxed text-stone-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-h-[70vh] w-full object-cover"
            />
            {post.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform hover:scale-105">
                  <Play className="h-7 w-7 text-stone-800" fill="currentColor" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <Avatar user={post.author} />
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-xs text-stone-500">{post.timestamp}</p>
            </div>
          </div>

          <h1 className="mb-2 text-xl font-bold">{post.title}</h1>
          <p className="mb-6 leading-relaxed text-stone-600">{post.caption}</p>

          <div className="mb-6 flex items-center gap-4 border-y border-stone-100 py-3">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                liked ? "text-red-500" : "text-stone-500 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-5 w-5", liked && "fill-current")} />
              {likeCount}
            </button>
            <span className="flex items-center gap-2 text-sm text-stone-500">
              <MessageCircle className="h-5 w-5" />
              {comments.length} comments
            </span>
          </div>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar user={c.author} size="sm" />
                <div className="flex-1 rounded-xl bg-stone-50 px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{c.author.name}</span>
                    <span className="text-xs text-stone-400">{c.timestamp}</span>
                  </div>
                  <p className="text-sm text-stone-600">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-4 flex gap-2">
            <Avatar user={currentUser} size="sm" />
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </form>
        </div>
      </article>
    </div>
  );
}
