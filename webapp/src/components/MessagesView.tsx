"use client";

import { useState } from "react";
import { ChevronLeft, Info, PenSquare, Camera, Mic, ImageIcon } from "lucide-react";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser, conversations, directMessages } from "@/lib/mock-data";
import { cn, formatTime } from "@/lib/utils";

export function MessagesView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(directMessages);
  const [input, setInput] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? messages[selectedId] || [] : [];

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
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
    <div className="flex h-[calc(100dvh-5rem)] overflow-hidden bg-app-bg md:h-[calc(100vh-3rem)] md:rounded-2xl md:border md:border-app-border">
      <div
        className={cn(
          "flex w-full flex-col md:w-[360px] md:border-r md:border-app-border-light",
          selectedId ? "hidden md:flex" : "flex"
        )}
      >
        <InboxHeader />
        <ul className="flex-1 overflow-y-auto">
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
            "flex min-w-0 flex-1 flex-col bg-app-bg",
            !selectedId ? "hidden md:flex" : "flex"
          )}
        >
          <div className="flex items-center gap-2 border-b border-app-border-light px-3 py-2.5">
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-full p-1.5 text-app-text hover:bg-app-surface-muted md:hidden"
              aria-label="Back to inbox"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex flex-1 items-center justify-center gap-2 md:justify-start">
              <Avatar user={selectedConv.participant} size="sm" />
              <p className="truncate font-semibold">{selectedConv.participant.name}</p>
            </div>
            <button
              className="rounded-full p-1.5 text-app-text hover:bg-app-surface-muted"
              aria-label="Conversation info"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
            {currentMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={cn("flex animate-fade-in", isMe ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] px-3.5 py-2 text-[15px] leading-snug",
                      isMe
                        ? "rounded-[22px] rounded-br-md bg-[#3797F0] text-white"
                        : "rounded-[22px] rounded-bl-md bg-app-surface-muted text-app-text"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-app-border-light bg-app-bg px-3 py-2.5"
          >
            <div className="flex min-h-11 items-center rounded-full border border-app-border bg-app-bg px-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message…"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] text-app-text outline-none placeholder:text-app-text-tertiary"
              />
              {input.trim() ? (
                <button
                  type="submit"
                  className="shrink-0 px-2 text-[15px] font-semibold text-[#3797F0]"
                >
                  Send
                </button>
              ) : (
                <div className="flex shrink-0 items-center gap-3 text-app-text">
                  <Camera className="h-5 w-5" />
                  <Mic className="h-5 w-5" />
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-app-text-tertiary md:flex">
          <p className="text-sm">Select a message</p>
        </div>
      )}
    </div>
  );
}

function InboxHeader() {
  return (
    <div className="flex items-center justify-between px-4 pb-3 pt-1">
      <h2 className="text-[22px] font-bold tracking-tight">
        {currentUser.handle.replace("@", "")}
      </h2>
      <button
        className="rounded-full p-1 text-app-text hover:bg-app-surface-muted"
        aria-label="New message"
      >
        <PenSquare className="h-[22px] w-[22px]" />
      </button>
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
  const unread = conversation.unread > 0;
  const firstName = conversation.participant.name.split(" ")[0];

  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-app-surface-muted",
          active && "bg-app-surface-muted"
        )}
      >
        <div className="relative shrink-0">
          <Avatar user={conversation.participant} size="lg" />
          {unread ? (
            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-app-bg bg-[#3797F0]" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 border-b border-app-border-light pb-3">
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={cn(
                "truncate text-base",
                unread ? "font-bold text-app-text" : "font-normal text-app-text"
              )}
            >
              {firstName}
            </p>
            <span className="shrink-0 text-[13px] text-app-text-tertiary">
              {conversation.lastMessageTime}
            </span>
          </div>
          <p
            className={cn(
              "truncate text-[15px]",
              unread ? "font-medium text-app-text" : "text-app-text-secondary"
            )}
          >
            {conversation.lastMessage}
          </p>
        </div>
      </button>
    </li>
  );
}
