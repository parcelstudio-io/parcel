import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: threads, error } = await supabase
      .from("agent_threads")
      .select(`
        *,
        user_a:profiles!agent_threads_user_a_id_fkey(id, username, display_name, avatar_url),
        user_b:profiles!agent_threads_user_b_id_fkey(id, username, display_name, avatar_url)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const formatted = (threads || []).map((t) => ({
      ...t,
      user_a: t.user_a,
      user_b: t.user_b,
    }));

    return NextResponse.json({ threads: formatted });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
