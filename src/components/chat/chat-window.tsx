"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Settings, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [recording, setRecording] = useState(false);
  const [memoryCount, setMemoryCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sessionIdRef = useRef(crypto.randomUUID());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/agent/memory")
      .then((r) => r.json())
      .then((d) => setMemoryCount(d.memory?.facts?.length ?? 0))
      .catch(() => {});
  }, [messages]);

  async function sendText(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setStreaming(true);

    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg, history: messages }),
    });

    if (!res.ok || !res.body) {
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantMsg = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantMsg += decoder.decode(value);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: assistantMsg };
        return updated;
      });
    }
    setStreaming(false);
  }

  async function toggleRecording() {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      await sendVoice(blob);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  }

  async function sendVoice(blob: Blob) {
    setStreaming(true);
    const formData = new FormData();
    formData.append("audio", blob);
    formData.append("session_id", sessionIdRef.current);

    const res = await fetch("/api/agent/voice", { method: "POST", body: formData });
    setStreaming(false);

    if (!res.ok) return;
    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: data.transcript },
      { role: "assistant", content: data.reply, audioUrl: data.audio_url },
    ]);

    if (data.audio_url) {
      new Audio(data.audio_url).play();
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div>
          <h1 className="text-lg font-semibold">Your Agent</h1>
          <Badge className="mt-1 text-xs bg-neutral-100 dark:bg-neutral-800">
            {memoryCount} memories learned
          </Badge>
        </div>
        <Link href="/chat/settings">
          <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-neutral-500 py-12">
            Tell your agent about yourself. It learns and remembers over time.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-neutral-800"
              }`}
            >
              {msg.content}
              {msg.audioUrl && (
                <audio controls src={msg.audioUrl} className="mt-2 w-full" />
              )}
            </div>
          </div>
        ))}
        {streaming && <p className="text-sm text-neutral-400 animate-pulse">Agent is thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendText} className="flex items-end gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
        <Button
          type="button"
          variant={recording ? "destructive" : "outline"}
          size="icon"
          onClick={toggleRecording}
          disabled={streaming}
        >
          {recording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          placeholder="Tell your agent something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming || recording}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

export function InstructionEditor({
  initialSystem,
  initialDeveloper,
}: {
  initialSystem: string;
  initialDeveloper: string;
}) {
  const [system, setSystem] = useState(initialSystem);
  const [developer, setDeveloper] = useState(initialDeveloper);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/agent/instructions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, developer }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium">System Instructions</label>
        <Textarea value={system} onChange={(e) => setSystem(e.target.value)} rows={8} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Developer Instructions</label>
        <Textarea value={developer} onChange={(e) => setDeveloper(e.target.value)} rows={8} />
      </div>
      <Button type="submit">{saved ? "Saved!" : "Save Instructions"}</Button>
    </form>
  );
}
