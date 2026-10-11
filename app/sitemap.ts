import type { MetadataRoute } from "next";
import { getSitemapPosts } from "@/lib/posts";
import { site, RETIRED_SLUGS } from "@/lib/site";

export const revalidate = 300;

// Same URLs, format and priorities as the original Hostinger sitemap
// (homepage has no trailing slash, priority 1.0; everything else 0.5).
const STATIC_LASTMOD = "2026-08-12T19:10:00.000Z";
const staticPages = ["/blog", "/about", "/contact", "/privacy-policy", "/terms-and-conditions"];
const newPages = ["/author/ashim", "/editorial-policy", "/tools", "/tools/out-of-pocket-calculator", "/tools/appeal-letter-generator"];
const NEW_LASTMOD = "2026-10-11T00:00:00.000Z";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getSitemapPosts()).filter((p) => !RETIRED_SLUGS.has(p.slug));
  const newest = posts.reduce((m, p) => (p.updatedAt > m ? p.updatedAt : m), STATIC_LASTMOD);

  return [
    { url: site.url, lastModified: newest, priority: 1.0 },
    { url: `${site.url}/blog`, lastModified: newest, priority: 0.5 },
    ...staticPages.slice(1).map((p) => ({ url: `${site.url}${p}`, lastModified: STATIC_LASTMOD, priority: 0.5 })),
    ...newPages.map((p) => ({ url: `${site.url}${p}`, lastModified: NEW_LASTMOD, priority: 0.5 })),
    ...posts.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: p.updatedAt, priority: 0.5 })),
  ];
}
