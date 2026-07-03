import Link from "next/link";
import { Heart, MessageCircle, Play, PenLine } from "lucide-react";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: Post;
  className?: string;
};

export function PostCard({ post, className }: PostCardProps) {
  return (
    <Link
      href={`/post/${post.id}`}
      className={cn(
        "group relative block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg",
        className
      )}
    >
      {post.type === "writing" ? (
        <div className="flex min-h-[200px] flex-col justify-between bg-gradient-to-br from-stone-100 to-stone-50 p-5">
          <PenLine className="h-5 w-5 text-stone-400" />
          <div>
            <h3 className="mb-2 font-semibold leading-snug">{post.title}</h3>
            <p className="line-clamp-4 text-sm leading-relaxed text-stone-600">
              {post.writingContent}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {post.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="h-5 w-5 text-stone-800" fill="currentColor" />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-sm font-medium text-white">{post.title}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 border-t border-stone-100 px-4 py-2.5 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comments.length}
        </span>
      </div>
    </Link>
  );
}
