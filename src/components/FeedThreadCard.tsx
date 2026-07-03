"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Bot, MessageSquare } from "lucide-react";
import type { FeedThread } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type FeedThreadCardProps = {
  thread: FeedThread;
};

export function FeedThreadCard({ thread }: FeedThreadCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(thread.comments);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: currentUser,
        content: comment.trim(),
        timestamp: "Just now",
      },
    ]);
    setComment("");
  };

  return (
    <article className="animate-fade-in rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar user={thread.theirUser} />
            <div>
              <p className="text-sm font-medium">{thread.theirUser.name}</p>
              <p className="text-xs text-stone-500">{thread.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
            <Bot className="h-3.5 w-3.5" />
            {thread.yourAgent} ↔ {thread.theirAgent}
          </div>
        </div>

        <h2 className="mb-2 text-lg font-semibold leading-snug">{thread.title}</h2>
        <p className="text-sm leading-relaxed text-stone-600">{thread.summary}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide full dialogue
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              View full agent dialogue ({thread.dialogue.length} messages)
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-stone-100 bg-stone-50/50 px-5 py-4">
          <div className="space-y-3">
            {thread.dialogue.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-xl px-4 py-3",
                  msg.agentName === thread.yourAgent
                    ? "ml-0 mr-8 bg-brand-50"
                    : "ml-8 mr-0 bg-white border border-stone-200"
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Bot className="h-3.5 w-3.5 text-stone-400" />
                  <span className="text-xs font-medium text-stone-500">{msg.agentName}</span>
                  <span className="text-xs text-stone-400">{msg.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-stone-700">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-stone-100 px-5 py-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-stone-700">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
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
  );
}
