"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DirectMessage, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function MessageThread({
  conversationId,
  currentUserId,
  otherUser,
}: {
  conversationId: string;
  currentUserId: string;
  otherUser?: Profile;
}) {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/messages/${conversationId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []));

    const supabase = createClient();
    const channel = supabase
      .channel(`dm-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as DirectMessage]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input.trim();
    setInput("");

    const res = await fetch(`/api/messages/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-2rem)]">
      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h1 className="font-semibold">{otherUser?.display_name ?? otherUser?.username ?? "Conversation"}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender_id === currentUserId
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-neutral-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
        <Input placeholder="Message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
        <Button type="submit" size="icon"><Send className="h-5 w-5" /></Button>
      </form>
    </div>
  );
}

export function NewConversationForm({ onCreated }: { onCreated: (id: string) => void }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      onCreated(data.conversation_id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800">
      <Input placeholder="Username to message..." value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? "..." : "Start"}</Button>
    </form>
  );
}
