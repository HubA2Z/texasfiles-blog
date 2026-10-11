import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { author } from "@/lib/author";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const revalidate = 300;

export function generateStaticParams() {
  return [{ slug: author.slug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== author.slug) return { title: "Not found", robots: { index: false } };
  return {
    title: `${author.name}, ${author.role}`,
    description: author.shortBio,
    alternates: { canonical: `/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== author.slug) notFound();
  const { posts } = await getPublishedPosts({ limit: 6 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.shortBio,
      url: `${site.url}/author/${author.slug}`,
      knowsAbout: author.expertise,
      sameAs: author.sameAs,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line">
        <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-center md:py-20">
          <span aria-hidden className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-ink font-serif text-5xl font-semibold text-white">
            {author.name.charAt(0)}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Author</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{author.name}</h1>
            <p className="mt-2 text-lg text-ink-soft">{author.role}</p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
          {author.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="text-base">
            How articles are researched, reviewed and updated is explained in our{" "}
            <Link href="/editorial-policy" className="font-semibold text-accent">editorial policy</Link>.
          </p>
        </div>
        <aside className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Areas of expertise</h2>
          <ul className="mt-4 space-y-2 text-ink">
            {author.expertise.map((e) => (
              <li key={e} className="flex gap-2"><span className="text-accent">•</span>{e}</li>
            ))}
          </ul>
        </aside>
      </section>

      {posts.length > 0 && (
        <section className="container-page">
          <h2 className="font-serif text-2xl font-semibold text-ink">Latest articles by {author.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
