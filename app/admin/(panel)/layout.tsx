import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { ensureSchema, sql } from "@/lib/db";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  let unread = 0;
  try {
    await ensureSchema();
    [{ unread }] = await sql<{ unread: number }[]>`SELECT count(*)::int AS unread FROM messages WHERE is_read = false`;
  } catch {}

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <header className="sticky top-0 z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link href="/admin" className="font-serif text-lg font-semibold text-ink">
            Texas<span className="text-accent">Files</span> <span className="ml-1 rounded bg-ink px-1.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/admin" className="rounded-md px-3 py-1.5 text-ink-soft hover:bg-paper hover:text-ink">Articles</Link>
            <Link href="/admin/messages" className="rounded-md px-3 py-1.5 text-ink-soft hover:bg-paper hover:text-ink">
              Messages{unread > 0 && <span className="ml-1.5 rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">{unread}</span>}
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden text-sm text-muted hover:text-ink sm:inline">View site ↗</Link>
            <form action={logout}>
              <button className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-ink hover:text-ink">Log out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
