"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages, agentResponses } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `cm-${Date.now()}-agent`,
        role: "agent",
        content: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 800);
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

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col rounded-2xl border border-stone-200 bg-white shadow-sm md:h-[calc(100vh-3rem)]">
      <div className="flex items-center gap-3 border-b border-stone-100 px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100">
          <Bot className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h2 className="font-semibold">Aria</h2>
          <p className="text-xs text-stone-500">Your personal agent</p>
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
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
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
                  : "bg-stone-100 text-stone-800"
              )}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  msg.role === "user" ? "text-brand-200" : "text-stone-400"
                )}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-stone-100 px-4 py-4">
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
          className="flex items-center gap-2"
        >
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isListening
                  ? "bg-red-100 text-red-600"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Aria about yourself..."
            className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {!speechSupported && (
          <p className="mt-2 text-center text-xs text-stone-400">
            Voice input requires a browser with Web Speech API support (Chrome, Edge, Safari).
          </p>
        )}
      </div>
    </div>
  );
}
