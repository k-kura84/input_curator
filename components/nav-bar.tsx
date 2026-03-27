"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Curate", href: "/curate", icon: Sparkles },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function NavBar() {
  const pathname = usePathname();

  // Hide nav bar on login page
  if (pathname === "/login" || pathname === "/error") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
