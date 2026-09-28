import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-page py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">404</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink">This page could not be found</h1>
        <p className="mt-4 text-ink-soft">The article may have moved. Try our full archive of guides.</p>
        <Link href="/blog" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
          Browse Guides & Articles
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
