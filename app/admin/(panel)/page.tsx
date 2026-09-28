import Link from "next/link";
import { adminListPosts } from "@/lib/posts";
import { formatDate } from "@/lib/site";

export default async function AdminHome() {
  const posts = await adminListPosts();
  const now = Date.now();
  const published = posts.filter((p) => p.status === "published").length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Articles</h1>
          <p className="mt-1 text-sm text-muted">
            {published} published · {posts.length - published} drafts
          </p>
        </div>
        <Link href="/admin/posts/new" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark">
          + New article
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        {posts.length === 0 ? (
          <p className="p-10 text-center text-muted">No articles yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p) => {
              const scheduled = p.status === "published" && p.publishedAt && +new Date(p.publishedAt) > now;
              const badge =
                p.status === "draft"
                  ? ["Draft", "bg-amber-100 text-amber-800"]
                  : scheduled
                    ? ["Scheduled", "bg-sky-100 text-sky-800"]
                    : ["Published", "bg-emerald-100 text-emerald-800"];
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/posts/${p.id}`} className="block truncate font-medium text-ink hover:text-accent">
                      {p.title}
                    </Link>
                    <p className="truncate text-xs text-muted">
                      /{p.slug}
                      {p.category && <> · {p.category}</>}
                      {" · "}
                      {p.publishedAt ? formatDate(p.publishedAt) : `edited ${formatDate(p.updatedAt)}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge[1]}`}>{badge[0]}</span>
                  <div className="flex gap-2 text-sm">
                    <Link href={`/admin/posts/${p.id}`} className="rounded-md border border-line px-2.5 py-1 hover:border-ink">Edit</Link>
                    {p.status === "published" && !scheduled && (
                      <Link href={`/${p.slug}`} target="_blank" className="rounded-md border border-line px-2.5 py-1 hover:border-ink">View</Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
