"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages } from "@/lib/mock-data";
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
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col bg-app-bg md:min-h-[calc(100vh-4rem)] md:border md:border-app-border">
      <header className="border-b border-app-border-light px-2 py-8 md:px-6">
        <p className="label-caps mb-4 text-app-text-secondary">My agent</p>
        <h2 className="text-[22px] font-medium tracking-tight">Aria</h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-app-text-secondary">
          Tell me about yourself — your interests, rhythm, and intentions.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-2 py-6 md:px-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "animate-fade-in",
              msg.role === "user" ? "text-right" : "text-left"
            )}
          >
            {msg.role === "agent" ? (
              <p className="max-w-[90%] text-[15px] leading-relaxed text-app-text md:max-w-[75%]">
                {msg.content}
              </p>
            ) : (
              <div className="ml-auto inline-block max-w-[85%] bg-app-agent-bubble px-4 py-3 text-left text-[15px] leading-relaxed text-app-text">
                {msg.content}
              </div>
            )}
            <p className="mt-1 text-xs text-app-text-tertiary">{msg.timestamp}</p>
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
          <div className="flex items-center gap-2 text-sm text-app-text-secondary">
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
            className="min-h-[52px] flex-1 border border-app-border bg-app-input-bg px-4 py-3.5 text-base text-app-text outline-none focus:border-app-text"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center bg-app-text text-app-bg transition-opacity hover:opacity-80 disabled:opacity-40"
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
