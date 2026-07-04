"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Layers, Circle, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock-data";

const navItems = [
  { href: "/", label: "Profile", icon: User },
  { href: "/feed", label: "Feed", icon: Layers },
  { href: "/chat", label: "Agent", icon: Circle },
  { href: "/messages", label: "Inbox", icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Main"
      >
        <div className="pointer-events-auto flex w-full max-w-[400px] items-center justify-around rounded-[10px] border border-black/10 bg-[rgba(250,249,246,0.94)] px-1 py-2 shadow-[0_2px_8px_rgba(26,26,24,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-[rgba(20,20,18,0.94)]">
          {navItems.map(({ href, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center gap-1 py-2"
                aria-label={href}
              >
                <Icon
                  className={cn(
                    "h-[22px] w-[22px]",
                    active ? "text-app-text" : "text-app-text-tertiary"
                  )}
                  strokeWidth={active ? 2 : 1.5}
                />
                {active ? <span className="h-1 w-1 rounded-full bg-app-text" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-app-border bg-app-surface md:flex">
        <div className="border-b border-app-border-light px-8 py-8">
          <p className="label-caps text-app-text">Parcel</p>
        </div>

        <div className="flex flex-1 flex-col px-6 py-8">
          <div className="mb-10 border-b border-app-border-light pb-8">
            <p className="font-medium">{currentUser.name}</p>
            <p className="mt-1 text-xs text-app-text-secondary">{currentUser.handle}</p>
          </div>

          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "text-app-text underline decoration-app-border underline-offset-4"
                        : "text-app-text-secondary hover:text-app-text"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-app-border-light px-8 py-6">
          <p className="label-caps text-app-text-tertiary">Agent · Aria</p>
        </div>
      </aside>
    </>
  );
}
