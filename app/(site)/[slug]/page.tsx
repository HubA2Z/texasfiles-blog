import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getPublishedPostBySlug, getRedirect, getRelated, getSitemapPosts } from "@/lib/posts";
import { formatDate, readingMinutes, site } from "@/lib/site";
import { author } from "@/lib/author";
import { extractFaqs } from "@/lib/faq";

export const revalidate = 300;
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    return (await getSitemapPosts()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Not found", robots: { index: false } };
  const title = post.seoTitle || post.title;
  const images = post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt || post.title }] : undefined;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/${post.slug}`,
      title,
      description: post.excerpt,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      section: post.category || undefined,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    const to = await getRedirect(slug);
    if (to) permanentRedirect(`/${to}`);
    notFound();
  }
  const related = await getRelated(post);
  const url = `${site.url}/${post.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      mainEntityOfPage: url,
      image: post.coverImage ? [post.coverImage] : undefined,
      articleSection: post.category || undefined,
      author: { "@type": "Person", name: author.name, jobTitle: author.role, url: `${site.url}/author/${author.slug}`, sameAs: author.sameAs },
      publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Guides & Articles", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  const faqs = extractFaqs(post.content);
  if (faqs.length >= 2) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    } as never);
  }
  const reviewed = post.updatedAt && post.publishedAt && post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt;

  const share = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-line">
        <div className="container-page max-w-3xl py-12 md:py-16">
          <nav className="text-xs text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-ink">Guides & Articles</Link>
          </nav>
          {post.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              {post.category}
            </Link>
          )}
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>
              By{" "}
              <Link href={`/author/${author.slug}`} className="font-medium text-ink underline-offset-4 hover:underline">
                {author.name}
              </Link>
              , {author.role.toLowerCase()}
            </span>
            {post.publishedAt && <span>Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></span>}
            {reviewed && post.publishedAt && formatDate(reviewed) !== formatDate(post.publishedAt) && (
              <span>Last reviewed <time dateTime={reviewed}>{formatDate(reviewed)}</time></span>
            )}
            <span>{readingMinutes(post.content)} min read</span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="container-page max-w-5xl pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.coverAlt || ""}
            className="aspect-[16/8] w-full rounded-2xl bg-line object-cover"
            fetchPriority="high"
          />
        </div>
      )}

      <div className="container-page max-w-3xl py-10">
        <div
          className="article prose prose-lg max-w-none prose-headings:font-semibold prose-h2:mt-12 prose-h3:mt-10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <section className="mt-12 flex gap-4 rounded-2xl border border-line bg-white p-5" aria-label="About the author">
          <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink font-serif text-xl font-semibold text-white">
            {author.name.charAt(0)}
          </span>
          <div className="text-sm">
            <p className="font-semibold text-ink">
              Written by <Link href={`/author/${author.slug}`} className="hover:text-accent">{author.name}</Link>
            </p>
            <p className="mt-1 leading-relaxed text-ink-soft">{author.shortBio}</p>
            <p className="mt-2 text-xs text-muted">
              Read our <Link href="/editorial-policy" className="underline underline-offset-2 hover:text-ink">editorial policy</Link>. Spotted something outdated?{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-ink">Tell us</Link>.
            </p>
          </div>
        </section>

        <aside className="mt-6 rounded-2xl border border-line bg-white p-5 text-sm text-ink-soft">
          <strong className="text-ink">Disclaimer:</strong> This article is for general informational purposes only and is not legal, medical, or financial advice. Verify details with your insurer, provider, or a qualified professional.
        </aside>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm">
          <span className="font-medium text-ink">Share:</span>
          <a className="rounded-full border border-line bg-white px-3 py-1.5 hover:border-ink" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${share}`}>Facebook</a>
          <a className="rounded-full border border-line bg-white px-3 py-1.5 hover:border-ink" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?url=${share}&text=${shareTitle}`}>X</a>
          <a className="rounded-full border border-line bg-white px-3 py-1.5 hover:border-ink" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`}>LinkedIn</a>
          <a className="rounded-full border border-line bg-white px-3 py-1.5 hover:border-ink" href={`mailto:?subject=${shareTitle}&body=${share}`}>Email</a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-6">
          <h2 className="font-serif text-2xl font-semibold text-ink">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
