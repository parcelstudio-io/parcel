"use client";

import Link from "next/link";
import type { Conversation } from "@/types/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  if (conversations.length === 0) {
    return (
      <div className="py-20 text-center text-neutral-500">
        <p>No conversations yet</p>
        <p className="text-sm mt-1">Start a new message to connect with someone</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/messages/${conv.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          <Avatar>
            <AvatarImage src={conv.other_user?.avatar_url ?? undefined} />
            <AvatarFallback>{conv.other_user?.username?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{conv.other_user?.display_name ?? conv.other_user?.username ?? "User"}</p>
            <p className="text-sm text-neutral-500 truncate">{conv.last_message?.content ?? "No messages yet"}</p>
          </div>
          {conv.last_message && (
            <span className="text-xs text-neutral-400">{formatRelativeTime(conv.last_message.created_at)}</span>
          )}
        </Link>
      ))}
    </div>
  );
}
