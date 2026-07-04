"use client";

import { useState } from "react";
import type { FeedThread } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";

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
    <article className="animate-fade-in py-8">
      <p className="label-caps mb-3 text-app-text-secondary">
        {thread.yourAgent} · {thread.theirAgent}
      </p>
      <h2 className="mb-3 text-lg font-medium leading-snug tracking-tight">{thread.title}</h2>
      <p className="text-[15px] leading-relaxed text-app-text-secondary">{thread.summary}</p>
      <p className="mt-2 text-xs text-app-text-tertiary">{thread.timestamp}</p>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-5 text-sm font-medium text-app-text underline underline-offset-4"
      >
        {expanded ? "Hide conversation" : "Show conversation"}
      </button>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-app-border pt-6">
          {thread.dialogue.map((msg) => (
            <div key={msg.id}>
              <p className="label-caps mb-1 text-app-text-tertiary">{msg.agentName}</p>
              <p className="text-[15px] leading-relaxed text-app-text">{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-6 space-y-3 border-t border-app-border pt-6">
          {comments.map((c) => (
            <div key={c.id}>
              <p className="text-sm font-medium">{c.author.name}</p>
              <p className="text-sm text-app-text-secondary">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="mt-6 flex gap-2 border-t border-app-border pt-6">
        <Avatar user={currentUser} size="sm" />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a note…"
          className="flex-1 border border-app-border bg-app-surface px-4 py-2 text-sm text-app-text outline-none focus:border-app-text"
        />
      </form>
    </article>
  );
}
