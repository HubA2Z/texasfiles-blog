import "server-only";
import { ensureSchema, hasDatabase, sql } from "./db";
import { seedPosts } from "./seed-data";
import { RETIRED_SLUGS } from "./site";

const RETIRED = [...RETIRED_SLUGS];

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  coverAlt: string | null;
  seoTitle: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Row = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string | null;
  cover_alt: string | null;
  seo_title: string | null;
  status: "draft" | "published";
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

const iso = (d: Date | null) => (d ? new Date(d).toISOString() : null);

function toPost(r: Row): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    coverImage: r.cover_image,
    coverAlt: r.cover_alt,
    seoTitle: r.seo_title,
    status: r.status,
    publishedAt: iso(r.published_at),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  };
}

// If no database is configured yet (e.g. first deploy), the public site still
// works using the migrated articles, so Google never sees broken pages.
function fallbackPosts(): Post[] {
  return seedPosts
    .filter((p) => !RETIRED_SLUGS.has(p.slug))
    .map((p, i) => ({
      id: i + 1,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      coverImage: p.coverImage,
      coverAlt: p.coverAlt,
      seoTitle: null,
      status: "published" as const,
      publishedAt: p.publishedAt,
      createdAt: p.publishedAt,
      updatedAt: p.publishedAt,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function ready(): Promise<boolean> {
  if (!hasDatabase) return false;
  try {
    await ensureSchema();
    return true;
  } catch (e) {
    console.error("[db] unavailable, using fallback content:", e);
    return false;
  }
}

/* ---------- public queries (published only) ---------- */

export async function getPublishedPosts(opts: { category?: string; q?: string; limit?: number; offset?: number } = {}) {
  const { category, q, limit = 12, offset = 0 } = opts;
  if (!(await ready())) {
    let list = fallbackPosts();
    if (category) list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (q) {
      const t = q.toLowerCase();
      list = list.filter((p) => (p.title + p.excerpt + p.content).toLowerCase().includes(t));
    }
    return { posts: list.slice(offset, offset + limit), total: list.length };
  }
  const like = q ? `%${q.replace(/[%_\\]/g, (m) => "\\" + m)}%` : null;
  const where = sql`status = 'published' AND published_at <= now() AND slug NOT IN ${sql(RETIRED)}
    ${category ? sql`AND lower(category) = lower(${category})` : sql``}
    ${like ? sql`AND (title ILIKE ${like} OR excerpt ILIKE ${like} OR content ILIKE ${like})` : sql``}`;
  const rows = await sql<Row[]>`SELECT * FROM posts WHERE ${where} ORDER BY published_at DESC, id DESC LIMIT ${limit} OFFSET ${offset}`;
  const [{ total }] = await sql<{ total: number }[]>`SELECT count(*)::int AS total FROM posts WHERE ${where}`;
  return { posts: rows.map(toPost), total };
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  if (!(await ready())) return fallbackPosts().find((p) => p.slug === slug) ?? null;
  const rows = await sql<Row[]>`SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' AND published_at <= now() LIMIT 1`;
  return rows[0] ? toPost(rows[0]) : null;
}

export async function getRedirect(slug: string): Promise<string | null> {
  if (!(await ready())) return null;
  const rows = await sql<{ to_slug: string }[]>`SELECT to_slug FROM redirects WHERE from_slug = ${slug} LIMIT 1`;
  return rows[0]?.to_slug ?? null;
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  if (!(await ready())) {
    const m = new Map<string, number>();
    for (const p of fallbackPosts()) if (p.category) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return [...m].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }
  return sql<{ name: string; count: number }[]>`
    SELECT category AS name, count(*)::int AS count FROM posts
    WHERE status = 'published' AND published_at <= now() AND category <> '' AND slug NOT IN ${sql(RETIRED)}
    GROUP BY category ORDER BY count DESC, category`;
}

export async function getRelated(post: Post, n = 3): Promise<Post[]> {
  const { posts } = await getPublishedPosts({ limit: 50 });
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, n);
}

export async function getSitemapPosts(): Promise<{ slug: string; updatedAt: string }[]> {
  if (!(await ready())) return fallbackPosts().map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
  const rows = await sql<{ slug: string; updated_at: Date }[]>`
    SELECT slug, updated_at FROM posts WHERE status = 'published' AND published_at <= now() AND slug NOT IN ${sql(RETIRED)} ORDER BY published_at DESC`;
  return rows.map((r) => ({ slug: r.slug, updatedAt: new Date(r.updated_at).toISOString() }));
}

/* ---------- admin queries ---------- */

export async function adminListPosts(): Promise<Post[]> {
  await ensureSchema();
  const rows = await sql<Row[]>`SELECT * FROM posts ORDER BY coalesce(published_at, updated_at) DESC, id DESC`;
  return rows.map(toPost);
}

export async function adminGetPost(id: number): Promise<Post | null> {
  await ensureSchema();
  const rows = await sql<Row[]>`SELECT * FROM posts WHERE id = ${id}`;
  return rows[0] ? toPost(rows[0]) : null;
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
  await ensureSchema();
  const rows = await sql`SELECT 1 FROM posts WHERE slug = ${slug} ${exceptId ? sql`AND id <> ${exceptId}` : sql``} LIMIT 1`;
  return rows.length > 0;
}

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  coverAlt: string | null;
  seoTitle: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
};

export async function adminCreatePost(p: PostInput): Promise<number> {
  await ensureSchema();
  const [{ id }] = await sql<{ id: number }[]>`
    INSERT INTO posts (slug, title, excerpt, content, category, cover_image, cover_alt, seo_title, status, published_at)
    VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.content}, ${p.category}, ${p.coverImage}, ${p.coverAlt}, ${p.seoTitle}, ${p.status}, ${p.publishedAt})
    RETURNING id`;
  // A new article reusing an old redirected slug takes priority over the redirect.
  await sql`DELETE FROM redirects WHERE from_slug = ${p.slug}`;
  return id;
}

export async function adminUpdatePost(id: number, p: PostInput): Promise<{ oldSlug: string }> {
  await ensureSchema();
  const prev = await adminGetPost(id);
  if (!prev) throw new Error("Post not found");
  await sql.begin(async (tx) => {
    await tx`
      UPDATE posts SET slug=${p.slug}, title=${p.title}, excerpt=${p.excerpt}, content=${p.content}, category=${p.category},
        cover_image=${p.coverImage}, cover_alt=${p.coverAlt}, seo_title=${p.seoTitle}, status=${p.status},
        published_at=${p.publishedAt}, updated_at=now()
      WHERE id=${id}`;
    await tx`DELETE FROM redirects WHERE from_slug = ${p.slug}`;
    // Keep old URLs alive: if a published article's slug changes, 301 the old one.
    if (prev.slug !== p.slug && prev.status === "published") {
      await tx`UPDATE redirects SET to_slug = ${p.slug} WHERE to_slug = ${prev.slug}`;
      await tx`INSERT INTO redirects (from_slug, to_slug) VALUES (${prev.slug}, ${p.slug})
               ON CONFLICT (from_slug) DO UPDATE SET to_slug = EXCLUDED.to_slug`;
    }
  });
  return { oldSlug: prev.slug };
}

export async function adminDeletePost(id: number): Promise<string | null> {
  await ensureSchema();
  const rows = await sql<{ slug: string }[]>`DELETE FROM posts WHERE id = ${id} RETURNING slug`;
  return rows[0]?.slug ?? null;
}
