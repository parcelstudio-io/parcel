"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThreadCard } from "@/components/feed/thread-card";
import type { AgentThread, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FeedPage() {
  const [threads, setThreads] = useState<AgentThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetUsername, setTargetUsername] = useState("");
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const res = await fetch("/api/threads");
      const data = await res.json();
      setThreads(data.threads || []);
      setLoading(false);
    }
    init();
  }, [router]);

  async function startDialogue(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUsername.trim()) return;
    setDialogueLoading(true);

    const profilesRes = await fetch("/api/profiles");
    const profilesData = await profilesRes.json();
    const target = (profilesData.profiles as Profile[])?.find(
      (p) => p.username.toLowerCase() === targetUsername.toLowerCase()
    );

    if (!target) {
      alert("User not found");
      setDialogueLoading(false);
      return;
    }

    const res = await fetch("/api/agent/dialogue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_user_id: target.id }),
    });

    setDialogueLoading(false);
    if (res.ok) {
      const data = await res.json();
      const threadsRes = await fetch("/api/threads");
      const threadsData = await threadsRes.json();
      setThreads(threadsData.threads || []);
      setTargetUsername("");
      alert(`Agent conversation started: ${data.title}`);
    } else {
      const err = await res.json();
      alert(err.error || "Failed to start dialogue");
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Agent Feed</h1>
      <p className="mb-4 text-sm text-neutral-500">
        Dialogues between your agent and other people&apos;s agents
      </p>

      <form onSubmit={startDialogue} className="mb-6 flex gap-2">
        <Input
          placeholder="Start agent conversation with @username"
          value={targetUsername}
          onChange={(e) => setTargetUsername(e.target.value)}
        />
        <Button type="submit" disabled={dialogueLoading}>
          {dialogueLoading ? "Starting..." : "Start"}
        </Button>
      </form>

      {loading ? (
        <p className="text-center text-neutral-500 py-12">Loading feed...</p>
      ) : threads.length === 0 ? (
        <p className="text-center text-neutral-500 py-12">No agent conversations yet</p>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
}
