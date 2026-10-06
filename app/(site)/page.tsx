import Link from "next/link";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getCategories, getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "TexasFiles — Unmasking Medical Debt", description: site.description, images: [{ url: site.ogImage, width: 1200, height: 630 }] },
};

const pillars = [
  {
    title: "Medical Billing Codes",
    body: "Decode every charge and understand your rights. Stop surprise bills in their tracks.",
    icon: "M9 12h6M9 16h6M9 8h2M6 3h9l4 4v14H6z",
  },
  {
    title: "Insurance Appeals",
    body: "Learn how to challenge denials and dispute unfair claims with confidence.",
    icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z M9 12l2 2 4-4",
  },
  {
    title: "Texas Regulations",
    body: "Stay informed on state-specific laws protecting consumers from predatory practices.",
    icon: "M4 21h16M6 18V10M10 18V10M14 18V10M18 18V10M3 10l9-6 9 6",
  },
];

export default async function Home() {
  const [{ posts }, categories] = await Promise.all([getPublishedPosts({ limit: 7 }), getCategories()]);
  const [featured, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(180,35,42,0.08),transparent_60%)]" />
        <div className="container-page grid gap-10 py-16 md:grid-cols-[1.25fr_1fr] md:items-center md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">TexasFiles presents</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              <span className="text-accent">Unmasking</span> Medical Debt
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Plain-English guides to navigate complex billing and insurance for Texas residents. Get clarity before you pay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/blog" className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark">
                Read the Guides
              </Link>
              <Link href="/contact" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-ink/40">
                Share your story
              </Link>
            </div>
          </div>
          {/* Illustrated "itemized bill" card */}
          <div aria-hidden className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 -z-10 rotate-3 rounded-3xl bg-ink/5" />
            <div className="rounded-2xl border border-line bg-white p-6 shadow-xl shadow-ink/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Itemized statement</p>
                <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase text-accent">Under review</span>
              </div>
              <ul className="mt-5 space-y-3 font-mono text-[13px] text-ink-soft">
                {[
                  ["99285 ER visit, lvl 5", "$2,140.00", false],
                  ["J7050 Saline 250 ml", "$412.00", true],
                  ["J7050 Saline 250 ml", "$412.00", true],
                  ["71046 Chest X-ray", "$689.00", false],
                  ["A4927 Gloves, box", "$96.00", true],
                ].map(([l, a, flag], i) => (
                  <li key={i} className={`flex justify-between gap-3 rounded px-2 py-1 ${flag ? "bg-accent-soft text-accent-dark line-through decoration-accent/60" : ""}`}>
                    <span>{l}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-end justify-between border-t border-dashed border-line pt-4">
                <span className="text-xs text-muted">Disputed</span>
                <span className="font-serif text-2xl font-semibold text-accent">−$920.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Our expertise</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">Your guide to clarity</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          We break down the complexities of healthcare finance into actionable, easy-to-understand strategies.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p.icon} />
                </svg>
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest */}
      <section className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Latest insights</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">New guides & articles</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-accent hover:text-accent-dark">
            See all guides →
          </Link>
        </div>
        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/blog?category=${encodeURIComponent(c.name)}`}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft hover:border-accent hover:text-accent"
              >
                {c.name} <span className="text-muted">({c.count})</span>
              </Link>
            ))}
          </div>
        )}
        {featured && (
          <div className="mt-8">
            <PostCard post={featured} featured />
          </div>
        )}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>

      {/* Commitment */}
      <section className="container-page mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(180,35,42,0.45),transparent_50%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Our commitment</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
              Independent. Investigative. For Texans.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/75">
              We exist to cut through bureaucratic jargon, protect you from surprise bills, and empower you with the knowledge to fight back against medical debt.
            </p>
            <Link href="/blog" className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink hover:bg-white/90">
              Explore all guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
