import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/posts";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Topics menu shows only categories that have published articles (never an empty category).
  const categories = await getCategories().then((c) => c.map((x) => x.name)).catch(() => [] as string[]);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <SiteHeader categories={categories} />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
