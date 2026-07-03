"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ConversationList } from "@/components/messages/conversation-list";
import { NewConversationForm } from "@/components/messages/message-thread";
import type { Conversation } from "@/types/database";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const res = await fetch("/api/messages");
      const data = await res.json();
      setConversations(data.conversations || []);
      setLoading(false);
    }
    init();
  }, [router]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>
      <NewConversationForm onCreated={(id) => router.push(`/messages/${id}`)} />
      {loading ? (
        <p className="p-4 text-neutral-500">Loading...</p>
      ) : (
        <ConversationList conversations={conversations} />
      )}
    </div>
  );
}
