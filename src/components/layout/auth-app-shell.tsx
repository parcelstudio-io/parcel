import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export async function AuthAppShell({ children }: { children: React.ReactNode }) {
  let user = null;
  let profile = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
      if (authUser) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
        profile = data;
      }
    } catch {
      // Supabase not configured
    }
  }

  return (
    <AppShell
      user={
        user
          ? {
              email: user.email,
              avatar_url: profile?.avatar_url,
              display_name: profile?.display_name,
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
