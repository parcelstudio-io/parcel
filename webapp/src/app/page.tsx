import { Avatar } from "@/components/Avatar";
import { posts, currentUser } from "@/lib/mock-data";
import Link from "next/link";

export default function ProfilePage() {
  const userPosts = posts.filter((p) => p.author.id === currentUser.id);

  return (
    <div className="mx-auto max-w-2xl px-6 pb-28 pt-8 md:px-10 md:py-12 md:pb-8">
      <p className="label-caps mb-12 text-center text-app-text">Parcel</p>

      <section className="mb-10">
        <p className="label-caps mb-4 text-app-text-secondary">The story</p>
        <h1 className="mb-4 text-[22px] font-medium tracking-tight">{currentUser.name}</h1>
        <p className="text-[15px] leading-relaxed text-app-text-secondary">
          Your personal agent learns who you are — your interests, rhythm, and intentions — so
          it can represent you with care. Share photos, writing, and moments; let Aria connect
          you through quiet, intentional dialogue.
        </p>
      </section>

      <div className="mb-8 flex items-center justify-center gap-8 border-y border-app-border py-6">
        <div className="text-center">
          <p className="text-lg font-medium">{userPosts.length}</p>
          <p className="text-xs text-app-text-secondary">Posts</p>
        </div>
        <div className="h-7 w-px bg-app-border" />
        <div className="text-center">
          <p className="text-lg font-medium">128</p>
          <p className="text-xs text-app-text-secondary">Connections</p>
        </div>
      </div>

      <button
        type="button"
        className="mb-12 w-full border border-app-border py-3 text-[13px] font-medium tracking-wide"
      >
        Edit profile
      </button>

      <section>
        <p className="label-caps mb-1 text-app-text-secondary">Collection</p>
        <p className="mb-8 text-sm text-app-text-tertiary">{currentUser.handle}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {userPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`} className="group">
              {post.type === "writing" ? (
                <div className="flex aspect-[4/5] items-end bg-app-surface-muted p-4">
                  <p className="text-sm font-medium leading-snug">{post.title}</p>
                </div>
              ) : (
                <div className="relative aspect-[4/5] overflow-hidden bg-app-surface-muted">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </div>
              )}
              <p className="mt-3 text-sm font-medium leading-snug">{post.title}</p>
              <p className="mt-1 text-[13px] text-app-text-secondary">
                {post.likes} appreciations · {post.comments.length} notes
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
