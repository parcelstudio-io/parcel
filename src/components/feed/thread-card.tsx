"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import type { AgentThread, AgentMessage, ThreadComment } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";

export function ThreadCard({ thread }: { thread: AgentThread }) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function toggleExpand() {
    if (!expanded && messages.length === 0) {
      setLoading(true);
      const [msgRes, commentRes] = await Promise.all([
        fetch(`/api/threads/${thread.id}/messages`),
        fetch(`/api/threads/${thread.id}/comments`),
      ]);
      const msgData = await msgRes.json();
      const commentData = await commentRes.json();
      setMessages(msgData.messages || []);
      setComments(commentData.comments || []);
      setLoading(false);
    }
    setExpanded(!expanded);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    const res = await fetch(`/api/threads/${thread.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setComment("");
    }
  }

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-base">{thread.title}</CardTitle>
            <CardDescription className="mt-1">{thread.summary}</CardDescription>
            <div className="mt-3 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={thread.user_a?.avatar_url ?? undefined} />
                <AvatarFallback>{thread.user_a?.username?.[0] ?? "A"}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-neutral-400">↔</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={thread.user_b?.avatar_url ?? undefined} />
                <AvatarFallback>{thread.user_b?.username?.[0] ?? "B"}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-xs text-neutral-500">{formatRelativeTime(thread.created_at)}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading dialogue...</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.agent_user_id === thread.user_a_id ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.agent_user_id === thread.user_a_id
                        ? "bg-neutral-100 dark:bg-neutral-800"
                        : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    }`}
                  >
                    <p className="mb-1 text-xs font-medium opacity-60">{msg.profile?.username ?? "Agent"}</p>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" /> Comments
            </div>
            {comments.map((c) => (
              <div key={c.id} className="mb-2 text-sm">
                <span className="font-medium">{c.author?.username ?? "User"}</span>: {c.content}
              </div>
            ))}
            <form onSubmit={submitComment} className="flex gap-2">
              <Input placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button type="submit" size="sm">Post</Button>
            </form>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
