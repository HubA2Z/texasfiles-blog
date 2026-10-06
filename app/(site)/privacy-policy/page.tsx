import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TexasFiles collects, uses, and protects your data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Our commitment to you"
        title="Privacy Policy"
        intro="Your trust is paramount. This document outlines how TexasFiles collects, uses, and protects your data, ensuring transparency and compliance with advertising standards."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose prose-lg max-w-none">
          <h2>Data Collection and Use</h2>
          <p>
            TexasFiles uses Google AdSense to serve relevant, non-intrusive advertisements that help fund the site. We are committed to maintaining a balance between providing valuable content and supporting our operations through responsible advertising practices.
          </p>
          <p>
            We do not sell your personal billing stories or contact information to third parties. Cookies are used solely to analyze traffic patterns, optimize your reading experience, and ensure the proper functioning of our site.
          </p>
          <h2>Information You Send Us</h2>
          <p>
            When you use our contact form, we receive the name, email address, and message you provide. We use it only to respond to you and to help us decide what guides to write, and we never publish identifying details without your explicit consent.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this policy? Send us a message through our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
