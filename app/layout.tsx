import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Texas Healthcare & Insurance Billing Blogs | ${site.titleSuffix}`,
    template: `%s | ${site.titleSuffix}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    locale: site.locale,
    type: "website",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image", images: [site.ogImage] },
  alternates: { types: { "application/rss+xml": `${site.url}/rss.xml` } },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0f1b2d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
