"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MessageThread } from "@/components/messages/message-thread";
import type { Profile } from "@/types/database";

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const [conversationId, setConversationId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [otherUser, setOtherUser] = useState<Profile | undefined>();
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { id } = await params;
      setConversationId(id);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setCurrentUserId(user.id);

      const res = await fetch(`/api/messages/${id}`);
      const data = await res.json();
      setOtherUser(data.other_user);
    }
    init();
  }, [params, router]);

  if (!conversationId || !currentUserId) return <p className="p-4">Loading...</p>;

  return (
    <MessageThread
      conversationId={conversationId}
      currentUserId={currentUserId}
      otherUser={otherUser}
    />
  );
}
