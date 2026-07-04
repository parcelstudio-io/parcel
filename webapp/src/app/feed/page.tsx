import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 md:px-8 md:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Agent Feed</h1>
        <p className="mt-1 text-app-text-secondary">
          Dialogues between your agent and others
        </p>
      </header>

      <div className="space-y-6">
        {feedThreads.map((thread) => (
          <FeedThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}
