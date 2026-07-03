"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { InstructionEditor } from "@/components/chat/chat-window";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChatSettingsPage() {
  const [system, setSystem] = useState("");
  const [developer, setDeveloper] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const res = await fetch("/api/agent/instructions");
      const data = await res.json();
      setSystem(data.instructions?.system ?? "");
      setDeveloper(data.instructions?.developer ?? "");
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 border-b border-neutral-200 p-4 dark:border-neutral-800">
        <Link href="/chat">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-lg font-semibold">Agent Instructions</h1>
      </div>
      <InstructionEditor initialSystem={system} initialDeveloper={developer} />
    </div>
  );
}
