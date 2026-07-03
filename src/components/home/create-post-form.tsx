"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PostType } from "@/types/database";

export function CreatePostForm({ onCreated }: { onCreated?: () => void }) {
  const [type, setType] = useState<PostType>("photo");
  const [caption, setCaption] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("caption", caption);
    if (type === "writing") formData.append("body", body);
    if (file) formData.append("file", file);

    const res = await fetch("/api/posts", { method: "POST", body: formData });
    setLoading(false);

    if (res.ok) {
      setCaption("");
      setBody("");
      setFile(null);
      onCreated?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex gap-2">
        {(["photo", "video", "writing"] as PostType[]).map((t) => (
          <Button key={t} type="button" variant={type === t ? "default" : "outline"} size="sm" onClick={() => setType(t)} className="capitalize">
            {t}
          </Button>
        ))}
      </div>
      {type === "writing" ? (
        <Textarea placeholder="Write something..." value={body} onChange={(e) => setBody(e.target.value)} required rows={4} />
      ) : (
        <Input type="file" accept={type === "photo" ? "image/*" : "video/*"} onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      )}
      <Input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Post"}</Button>
    </form>
  );
}
