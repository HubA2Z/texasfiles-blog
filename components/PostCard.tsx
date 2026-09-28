import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate, readingMinutes } from "@/lib/site";

function Cover({ post, className }: { post: Post; className: string }) {
  if (post.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.coverImage} alt={post.coverAlt || ""} loading="lazy" className={`${className} bg-line object-cover`} />
    );
  }
  // Typographic placeholder for articles without a cover image.
  return (
    <div className={`${className} relative overflow-hidden bg-ink`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(180,35,42,0.55),transparent_55%)]" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">{post.category || "Guide"}</span>
        <span className="mt-1 line-clamp-3 font-serif text-lg leading-snug text-white">{post.title}</span>
      </div>
    </div>
  );
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const meta = (
    <p className="text-xs font-medium text-muted">
      {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
      <span className="mx-1.5">·</span>
      {readingMinutes(post.content)} min read
    </p>
  );

  if (featured) {
    return (
      <Link href={`/${post.slug}`} className="group grid overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-2">
        <Cover post={post} className="aspect-[16/10] w-full md:aspect-auto md:h-full" />
        <div className="flex flex-col justify-center p-6 sm:p-8">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{post.category}</span>
          )}
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink group-hover:text-accent sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-ink-soft">{post.excerpt}</p>
          <div className="mt-5">{meta}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <Cover post={post} className="aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{post.category}</span>
        )}
        <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink group-hover:text-accent">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
        <div className="mt-auto pt-4">{meta}</div>
      </div>
    </Link>
  );
}
