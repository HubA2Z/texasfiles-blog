import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl font-semibold text-white">
            Texas<span className="text-[#ff8a8f]">Files</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Unmasking medical debt. Plain-English guides for Texas consumers on billing, insurance and your rights.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">Texas healthcare demystified</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/blog">Guides & Articles</Link></li>
            <li><Link className="hover:text-white" href="/about">About Us</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
            <li><a className="hover:text-white" href="/rss.xml">RSS feed</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/contact">Send us a message</Link></li>
            <li><Link className="hover:text-white" href="/about#author">About the author</Link></li>
            <li>Plain-English medical billing guides</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TexasFiles · Plain-English guides. No insurance jargon.</p>
          <div className="flex gap-5">
            <Link className="hover:text-white" href="/terms-and-conditions">Terms & Conditions</Link>
            <Link className="hover:text-white" href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
