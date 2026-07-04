"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Rss, Bot, MessagesSquare, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Profile", icon: User },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/chat", label: "My Agent", icon: Bot },
  { href: "/messages", label: "Messages", icon: MessagesSquare },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Main"
      >
        <div className="pointer-events-auto flex w-full max-w-[420px] items-center justify-around rounded-[32px] border border-black/5 bg-white/75 px-2 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(20,20,20,0.72)]">
          {navItems.map(({ href, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-2xl py-2.5 transition-opacity active:opacity-60",
                  active ? "text-app-text" : "text-app-text-secondary"
                )}
                aria-label={href}
              >
                <Icon className="h-[26px] w-[26px]" strokeWidth={active ? 2.25 : 1.75} />
              </Link>
            );
          })}
        </div>
      </nav>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-app-border bg-app-surface md:flex">
        <div className="flex items-center gap-2 border-b border-app-border-light px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Parcel</span>
        </div>

        <div className="flex flex-1 flex-col px-4 py-6">
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-app-surface-muted px-4 py-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full bg-app-surface-muted"
            />
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-app-text-secondary">{currentUser.handle}</p>
            </div>
          </div>

          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-app-nav-active text-app-nav-active-text"
                        : "text-app-text-secondary hover:bg-app-surface-muted hover:text-app-text"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-app-border-light px-6 py-4">
          <p className="text-xs text-app-text-tertiary">Agent: Aria</p>
        </div>
      </aside>
    </>
  );
}
