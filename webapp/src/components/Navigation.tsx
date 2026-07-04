"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Rss, MessageCircle, MessagesSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/chat", label: "My Agent", icon: Bot },
  { href: "/messages", label: "Messages", icon: MessagesSquare },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-app-border bg-app-surface/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs transition-colors",
                  active ? "text-brand-600" : "text-app-text-secondary hover:text-app-text"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
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
