"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
  const SpeechRecognition =
    typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : undefined;
    setSpeechSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: formatTime(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Agent unavailable");
      }
      const agentMsg: ChatMessage = {
        id: `cm-${Date.now()}-agent`,
        role: "agent",
        content: data.reply ?? "Sorry, I couldn't respond.",
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reach Aria. Run `pnpm setup:gemma` and ensure Ollama is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollInputIntoView = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex h-[calc(100dvh-5rem)] flex-col bg-app-bg md:h-[calc(100vh-3rem)] md:rounded-2xl md:border md:border-app-border">
      <div className="flex items-center gap-3 border-b border-app-border-light px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-app-accent-soft">
          <Bot className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h2 className="font-semibold">Aria</h2>
          <p className="text-xs text-app-text-secondary">Powered by Gemma · your personal agent</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {msg.role === "agent" ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent-soft">
                <Bot className="h-4 w-4 text-brand-600" />
              </div>
            ) : (
              <Avatar user={currentUser} size="sm" />
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-app-agent-bubble text-app-text"
              )}
            >
              <p className="text-[15px] leading-relaxed">{msg.content}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  msg.role === "user" ? "text-brand-200" : "text-app-text-tertiary"
                )}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-app-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Aria is thinking…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-app-border-light bg-app-bg px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {error && (
          <p className="mb-2 text-center text-xs text-red-500">{error}</p>
        )}
        {isListening && (
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-brand-600">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-400" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
            </span>
            Listening...
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-2"
        >
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              className={cn(
                "mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
                isListening
                  ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                  : "bg-app-surface-muted text-app-text-secondary hover:bg-app-border"
              )}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={scrollInputIntoView}
            placeholder="Message Aria…"
            disabled={isLoading}
            className="min-h-[52px] flex-1 rounded-full border border-app-border bg-app-input-bg px-5 py-3.5 text-base text-app-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-app-accent-soft"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {!speechSupported && (
          <p className="mt-2 text-center text-xs text-app-text-tertiary">
            Voice input requires a browser with Web Speech API support (Chrome, Edge, Safari).
          </p>
        )}
      </div>
    </div>
  );
}
