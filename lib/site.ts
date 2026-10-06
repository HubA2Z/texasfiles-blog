export const site = {
  name: "TexasFiles",
  tagline: "Unmasking Medical Debt",
  // Kept identical to the original site's title suffix / description for SEO continuity.
  titleSuffix: "TexasFiles",
  description:
    "Explore our insightful blogs on Texas healthcare, insurance billing, and medical billing. Stay informed about the latest trends, coverage options, and important updates in the healthcare sector.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://texasfiles.in").replace(/\/$/, ""),
  author: {
    name: "Ashim",
    role: "Medical Billing Specialist",
    bio: "Ashim works in US medical billing and revenue cycle management: following up on insurance claims, working denials and appeals, and checking claim status with payers such as UnitedHealthcare, Cigna, Optum, UMR and Meritain Health every day. TexasFiles turns that hands-on experience into plain-English guides for patients.",
  },
  ogImage: "/og.png",
  locale: "en_US",
};

// Top-level paths that can never be used as an article slug.
export const RESERVED_SLUGS = new Set([
  "",
  "blog",
  "about",
  "contact",
  "privacy-policy",
  "terms-and-conditions",
  "admin",
  "api",
  "rss.xml",
  "feed",
  "sitemap.xml",
  "robots.txt",
  "category",
  "search",
  "_next",
  "favicon.ico",
  "icon.svg",
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}
