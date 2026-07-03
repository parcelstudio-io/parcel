import { notFound } from "next/navigation";
import { PostDetail } from "@/components/PostDetail";
import { posts } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 pb-24 md:px-8 md:py-8">
      <PostDetail post={post} />
    </div>
  );
}
