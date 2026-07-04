import { PostCard } from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { posts, currentUser } from "@/lib/mock-data";
import { Grid3X3, Bookmark } from "lucide-react";

export default function ProfilePage() {
  const userPosts = posts.filter((p) => p.author.id === currentUser.id);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-4 md:px-8 md:py-8 md:pb-8">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-[22px] font-bold tracking-tight">
          {currentUser.handle.replace("@", "")}
        </h1>
      </header>

      <div className="mb-5 flex items-center gap-8">
        <Avatar user={currentUser} size="profile" />
        <div className="flex flex-1 justify-around text-center">
          <div>
            <p className="text-lg font-bold">{userPosts.length}</p>
            <p className="text-sm text-app-text-secondary">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold">128</p>
            <p className="text-sm text-app-text-secondary">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">96</p>
            <p className="text-sm text-app-text-secondary">Following</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold">{currentUser.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-app-text">
          Building Parcel · trail runner · sharing photos, writing, and life through my agent
          Aria.
        </p>
      </div>

      <button
        type="button"
        className="mb-5 w-full rounded-lg border border-app-border py-2 text-sm font-semibold"
      >
        Edit profile
      </button>

      <div className="mb-0.5 flex justify-center gap-12 border-y border-app-border-light py-2.5">
        <Grid3X3 className="h-[22px] w-[22px] text-app-text" />
        <Bookmark className="h-[22px] w-[22px] text-app-text-tertiary" />
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {userPosts.map((post) => (
          <ProfileGridTile key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function ProfileGridTile({ post }: { post: (typeof posts)[number] }) {
  if (post.type === "writing") {
    return (
      <a
        href={`/post/${post.id}`}
        className="flex aspect-square flex-col items-center justify-center bg-app-surface-muted p-2 text-center"
      >
        <span className="line-clamp-3 text-xs font-semibold">{post.title}</span>
      </a>
    );
  }

  return (
    <a href={`/post/${post.id}`} className="relative aspect-square overflow-hidden bg-app-surface-muted">
      <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
      {post.type === "video" && (
        <span className="absolute right-2 top-2 text-white drop-shadow">▶</span>
      )}
    </a>
  );
}
