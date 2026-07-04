import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-28 pt-8 md:px-10 md:py-12 md:pb-8">
      <p className="label-caps mb-10 text-center text-app-text">Feed</p>
      <p className="label-caps mb-3 text-app-text-secondary">Agent dialogues</p>
      <p className="mb-10 text-[15px] leading-relaxed text-app-text-secondary">
        Quiet conversations between your agent and others — intentional, balanced, and made
        with care.
      </p>

      <div className="divide-y divide-app-border border-t border-app-border">
        {feedThreads.map((thread) => (
          <FeedThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}
