"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "All Guides" },
  { href: "/tools", label: "Free Tools" },
  { href: "/about", label: "About" },
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

const topicHref = (c: string) => `/blog?category=${encodeURIComponent(c)}`;

function TopicsMenu({ categories }: { categories: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hoverAt = useRef(0);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => { hoverAt.current = Date.now(); setOpen(true); }} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => { if (Date.now() - hoverAt.current < 500) return; setOpen((o) => !o); }}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        Topics
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={open ? "rotate-180 transition-transform" : "transition-transform"} aria-hidden><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <ul className="w-60 rounded-xl border border-line bg-white p-2 shadow-lg">
            {categories.map((c) => (
              <li key={c}><Link href={topicHref(c)} className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-paper hover:text-ink">{c}</Link></li>
            ))}
            <li className="mt-1 border-t border-line pt-1"><Link href="/blog" className="block rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:bg-paper">All guides</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader({ categories = [] }: { categories?: string[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.slice(0, 2).map((n) => (
            <Link key={n.href} href={n.href} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active(n.href) ? "text-accent" : "text-ink-soft hover:text-ink"}`}>
              {n.label}
            </Link>
          ))}
          {categories.length > 0 && <TopicsMenu categories={categories} />}
          {nav.slice(2).map((n) => (
            <Link key={n.href} href={n.href} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active(n.href) ? "text-accent" : "text-ink-soft hover:text-ink"}`}>
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
            {categories.length > 0 && (
              <div className="border-b border-line pb-2">
                <p className="pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Topics</p>
                <div className="grid grid-cols-2">
                  {categories.map((c) => (
                    <Link key={c} href={topicHref(c)} onClick={() => setOpen(false)} className="py-2.5 text-[0.95rem] text-ink">{c}</Link>
                  ))}
                </div>
              </div>
            )}
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
