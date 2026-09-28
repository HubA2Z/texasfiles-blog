import Link from "next/link";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getCategories, getPublishedPosts } from "@/lib/posts";

const PER_PAGE = 12;

type SP = Promise<{ category?: string; q?: string; page?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { category, q, page } = await searchParams;
  const filtered = Boolean(category || q || (page && page !== "1"));
  return {
    title: category ? `${category} — Guides & Articles` : "Guides & Articles",
    description:
      "Step-by-step instructions, actionable line-item breakdowns, and up-to-date coverage of Texas-specific regulations to protect you from surprise medical bills.",
    alternates: { canonical: "/blog" },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { url: "/blog", title: "Guides & Articles | TexasFiles" },
  };
}

export default async function BlogIndex({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const q = (sp.q || "").trim().slice(0, 100);
  const category = (sp.category || "").trim().slice(0, 60);
  const [{ posts, total }, categories] = await Promise.all([
    getPublishedPosts({ category: category || undefined, q: q || undefined, limit: PER_PAGE, offset: (page - 1) * PER_PAGE }),
    getCategories(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (category) u.set("category", category);
    if (q) u.set("q", q);
    if (p > 1) u.set("page", String(p));
    const s = u.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Texas consumer defense</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Guides & Articles</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Step-by-step instructions, actionable line-item breakdowns, and up-to-date coverage of Texas-specific regulations to protect you from surprise medical bills.
          </p>
          <form action="/blog" className="mt-8 flex max-w-lg gap-2" role="search">
            {category && <input type="hidden" name="category" value={category} />}
            <label htmlFor="q" className="sr-only">Search articles</label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Search guides — e.g. itemized bill, SB 1264"
              className="min-w-0 flex-1 rounded-full border border-line bg-white px-5 py-3 text-sm outline-none focus:border-ink"
            />
            <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-soft">Search</button>
          </form>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/blog?q=${encodeURIComponent(q)}` : "/blog"}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${!category ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"}`}
          >
            All
          </Link>
          {categories.map((c) => {
            const on = c.name.toLowerCase() === category.toLowerCase();
            return (
              <Link
                key={c.name}
                href={`/blog?category=${encodeURIComponent(c.name)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"}`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>

        {(q || category) && (
          <p className="mt-6 text-sm text-muted">
            {total} {total === 1 ? "article" : "articles"}
            {q && <> matching “{q}”</>}
            {category && <> in {category}</>}
          </p>
        )}

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-ink-soft">
            No articles found. <Link href="/blog" className="font-semibold text-accent">View all guides</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
            {page > 1 && <Link className="rounded-full border border-line bg-white px-4 py-2 text-sm" href={qs(page - 1)}>← Newer</Link>}
            <span className="px-3 text-sm text-muted">Page {page} of {pages}</span>
            {page < pages && <Link className="rounded-full border border-line bg-white px-4 py-2 text-sm" href={qs(page + 1)}>Older →</Link>}
          </nav>
        )}
      </section>
    </>
  );
}
