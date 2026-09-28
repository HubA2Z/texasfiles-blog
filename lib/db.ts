import "server-only";
import postgres from "postgres";
import { seedPosts } from "./seed-data";

// Works with Neon / Vercel Postgres / Supabase or any Postgres URL.
const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  "";

declare global {
  var __sql: ReturnType<typeof postgres> | undefined;
  var __schemaReady: Promise<void> | undefined;
}

export const hasDatabase = Boolean(url);

function makeClient() {
  const isLocal = /localhost|127\.0\.0\.1|\/tmp|host=\//.test(url);
  return postgres(url, {
    ssl: isLocal ? false : "require",
    max: 3,
    idle_timeout: 20,
    onnotice: () => {},
    prepare: false, // required for pooled (pgbouncer) connections
  });
}

export const sql: ReturnType<typeof postgres> =
  globalThis.__sql ?? (globalThis.__sql = makeClient());

async function migrate() {
  // Serialize migrations across concurrent serverless instances / build workers.
  await sql.begin(async (sql) => {
  await sql`SELECT pg_advisory_xact_lock(84201157)`;
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id            SERIAL PRIMARY KEY,
      slug          TEXT UNIQUE NOT NULL,
      title         TEXT NOT NULL,
      excerpt       TEXT NOT NULL DEFAULT '',
      content       TEXT NOT NULL DEFAULT '',
      category      TEXT NOT NULL DEFAULT '',
      cover_image   TEXT,
      cover_alt     TEXT,
      seo_title     TEXT,
      status        TEXT NOT NULL DEFAULT 'draft',
      published_at  TIMESTAMPTZ,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS posts_status_pub ON posts (status, published_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS redirects (
      from_slug  TEXT PRIMARY KEY,
      to_slug    TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      body       TEXT NOT NULL,
      is_read    BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id         SERIAL PRIMARY KEY,
      ip         TEXT NOT NULL,
      success    BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

  // One-time import of the articles from the original site.
  const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM posts`;
  if (count === 0) {
    for (const p of seedPosts) {
      await sql`
        INSERT INTO posts (slug, title, excerpt, content, category, cover_image, cover_alt, status, published_at, created_at, updated_at)
        VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.content}, ${p.category}, ${p.coverImage}, ${p.coverAlt},
                'published', ${p.publishedAt}, ${p.publishedAt}, ${p.publishedAt})
        ON CONFLICT (slug) DO NOTHING`;
    }
  }
  });
}

export function ensureSchema(): Promise<void> {
  if (!hasDatabase) return Promise.reject(new Error("DATABASE_URL is not set"));
  if (!globalThis.__schemaReady) {
    globalThis.__schemaReady = migrate().catch((e) => {
      globalThis.__schemaReady = undefined;
      throw e;
    });
  }
  return globalThis.__schemaReady;
}
