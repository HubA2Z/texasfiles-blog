"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Guides & Articles" },
  { href: "/about", label: "About Our Mission" },
  { href: "/contact", label: "Contact Us" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight text-ink">
      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
        T<span className="ml-px inline-block h-1.5 w-1.5 translate-y-1.5 rounded-full bg-accent" />
      </span>
      Texas<span className="-ml-2.5 text-accent">Files</span>
    </Link>
  );
}

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active(n.href) ? "text-accent" : "text-ink-soft hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/blog"
            className="ml-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
          >
            Read the Guides
          </Link>
        </nav>
        <button
          className="-mr-2 rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="border-t border-line bg-paper md:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base font-medium ${active(n.href) ? "text-accent" : "text-ink"}`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
