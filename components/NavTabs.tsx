"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "SIGHTINGS MAP", href: "/" },
  { label: "SPACE WATCH", href: "/space-watch" },
] as const;

// Phase 3 will turn this into a real tab
const comingSoon = ["LATEST SIGNALS"];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 font-mono text-xs tracking-wider">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-accent"
                : "rounded-md border border-panel-border px-3 py-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
            }
          >
            {tab.label}
          </Link>
        );
      })}
      {comingSoon.map((label) => (
        <span
          key={label}
          title="Coming in a later phase"
          className="cursor-not-allowed rounded-md border border-panel-border px-3 py-2 text-muted/60"
        >
          {label}
        </span>
      ))}
    </nav>
  );
}
