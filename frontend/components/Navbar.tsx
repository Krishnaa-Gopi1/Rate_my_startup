"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Mascot from "./Mascot";

const LINKS = [
  { href: "/", label: "Roast" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/hall-of-shame", label: "Hall of Shame" },
  { href: "/about", label: "About" },
];

interface Props {
  roastedCount?: number;
}

export default function Navbar({ roastedCount = 127 }: Props) {
  const pathname = usePathname();
  const digits = String(roastedCount).padStart(3, "0").split("");

  return (
    <nav className="border-b-[3px] border-ink bg-paper">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="frame-sm bg-paper-cream p-1.5 w-12 h-12 flex items-center justify-center">
            <Mascot size={36} wiggle expression="happy" />
          </div>
          <div className="leading-none">
            <div className="heading text-xs uppercase tracking-wider">Startup</div>
            <div className="display text-2xl text-roast-gold" style={{ WebkitTextStroke: "1.5px #1a1612" }}>
              ROAST
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 frame-flat px-2 py-1.5">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`nav-link ${active ? "active" : ""}`}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Roasted counter */}
        <div className="flex items-center gap-2">
          <div className="text-right leading-none mr-1">
            <div className="heading text-[10px] uppercase tracking-widest text-ink-muted">Roasted</div>
          </div>
          <div className="flex gap-1">
            {digits.map((d, i) => (
              <div
                key={i}
                className={`frame-sm w-7 h-9 flex items-center justify-center heading text-lg ${
                  i === digits.length - 1 ? "bg-roast-yellow" : "bg-paper-cream"
                }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t-[2px] border-ink overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href} className={`nav-link text-xs whitespace-nowrap ${active ? "active" : ""}`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
