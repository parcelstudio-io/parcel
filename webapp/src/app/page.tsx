import { PostCard } from "@/components/PostCard";
import { posts } from "@/lib/mock-data";
import { currentUser } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="px-4 py-6 pb-24 md:px-8 md:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{currentUser.name}</h1>
        <p className="mt-1 text-app-text-secondary">
          Your photos, writings, and moments
        </p>
      </header>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} className="mb-4" />
        ))}
      </div>
    </div>
  );
}
