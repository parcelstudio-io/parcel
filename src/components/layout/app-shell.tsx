"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Rss, MessageCircle, Bot, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/chat", label: "Agent", icon: Bot },
  { href: "/messages", label: "Messages", icon: MessageCircle },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { email?: string; avatar_url?: string | null; display_name?: string | null } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthPage) {
    return <>{children}</>;
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-neutral-200 md:px-4 md:py-6 dark:md:border-neutral-800">
        <Link href="/" className="mb-8 text-xl font-bold tracking-tight">
          Parcel
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="mt-auto flex items-center gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback>{user.display_name?.[0] ?? user.email?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <button onClick={handleSignOut} className="text-sm text-neutral-500 hover:text-neutral-900">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-neutral-200 bg-white/95 backdrop-blur md:hidden dark:border-neutral-800 dark:bg-neutral-950/95">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
              pathname === href || (href !== "/" && pathname.startsWith(href))
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-400"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
