import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

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
        intro="How TexasFiles collects, uses and protects information when you visit the site or contact us."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose prose-lg max-w-none">
          <h2>Data Collection and Use</h2>
          <p>
            TexasFiles may use Google AdSense to show advertisements that support the site. Google and its partners use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.
          </p>
          <p>
            We do not sell the information you send us to third parties. We and our service providers may use cookies and similar technologies to keep the site working, understand how it's used, and show advertising.
          </p>
          <h2>Information You Send Us</h2>
          <p>
            When you use our contact form, we receive the name, email address, and message you provide. We use it only to respond to you and to improve our guides, and we never publish identifying details without your explicit consent.
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
