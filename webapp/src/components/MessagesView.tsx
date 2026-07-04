"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser, conversations, directMessages } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";

export function MessagesView() {
  const [selectedId, setSelectedId] = useState<string | null>("conv1");
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(directMessages);
  const [input, setInput] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? messages[selectedId] || [] : [];

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedId) return;

    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      content: input.trim(),
      timestamp: formatTime(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border border-app-border bg-app-surface shadow-sm md:h-[calc(100vh-3rem)]">
      <div
        className={cn(
          "w-full border-r border-app-border-light md:w-80 md:block",
          selectedId ? "hidden md:block" : "block"
        )}
      >
        <div className="border-b border-app-border-light px-5 py-4">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <ul>
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              active={selectedId === conv.id}
              onClick={() => setSelectedId(conv.id)}
            />
          ))}
        </ul>
      </div>

      {selectedConv ? (
        <div
          className={cn(
            "flex flex-1 flex-col",
            !selectedId ? "hidden md:flex" : "flex"
          )}
        >
          <div className="flex items-center gap-3 border-b border-app-border-light px-5 py-4">
            <button
              onClick={() => setSelectedId(null)}
              className="text-sm text-brand-600 md:hidden"
            >
              ← Back
            </button>
            <Avatar user={selectedConv.participant} size="sm" />
            <div>
              <p className="font-medium">{selectedConv.participant.name}</p>
              <p className="text-xs text-app-text-secondary">{selectedConv.participant.handle}</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex animate-fade-in",
                    isMe ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5",
                      isMe
                        ? "bg-brand-600 text-white"
                        : "bg-app-agent-bubble text-app-text"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        isMe ? "text-brand-200" : "text-app-text-tertiary"
                      )}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-app-border-light px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-app-border bg-app-input-bg px-4 py-2.5 text-sm text-app-text outline-none focus:border-brand-400 focus:ring-2 focus:ring-app-accent-soft"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-app-text-tertiary md:flex">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
}

function ConversationItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-app-surface-muted",
          active && "bg-app-nav-active"
        )}
      >
        <Avatar user={conversation.participant} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate font-medium">{conversation.participant.name}</p>
            <span className="shrink-0 text-xs text-app-text-tertiary">
              {conversation.lastMessageTime}
            </span>
          </div>
          <p className="truncate text-sm text-app-text-secondary">{conversation.lastMessage}</p>
        </div>
        {conversation.unread > 0 && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
            {conversation.unread}
          </span>
        )}
      </button>
    </li>
  );
}
