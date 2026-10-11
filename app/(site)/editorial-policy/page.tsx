import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { author } from "@/lib/author";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How TexasFiles researches, writes, reviews and updates its guides to medical billing and health insurance.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicy() {
  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="Editorial Policy"
        intro="Our goal is simple: accurate, practical explanations of medical billing and health insurance that help readers take the right next step."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose prose-lg max-w-none">
          <h2>Who writes our content</h2>
          <p>
            TexasFiles articles are written and reviewed by <Link href={`/author/${author.slug}`}>{author.name}</Link>, a {author.role.toLowerCase()} who works claim follow-up, denials and appeals every day. Topics come from real billing problems: the denials, coding errors and coverage rules that patients and billing teams run into most often.
          </p>
          <h2>How articles are researched</h2>
          <ul>
            <li>We rely on primary sources wherever possible, including CMS and Medicare manuals, HealthCare.gov, the Texas Department of Insurance, and payer policies.</li>
            <li>When a rule varies by plan or payer, we say so and tell readers how to confirm it for their own situation.</li>
            <li>We use AI writing tools to help with research and drafting. Every article is reviewed, edited and fact-checked by our author before it's published, and the author is responsible for its accuracy.</li>
          </ul>
          <h2>Accuracy and updates</h2>
          <p>
            Billing and insurance rules change, often every January. We review articles when rules change and show a "last reviewed" date on each article. If you spot an error or an outdated rule, please <Link href="/contact">contact us</Link> and we'll review it promptly. Significant corrections are noted in the article.
          </p>
          <h2>Independence and advertising</h2>
          <p>
            TexasFiles is independent. We are not affiliated with any insurance company, hospital, billing company, government agency or law firm, and no one pays to influence what we write. The site is supported by display advertising, which is clearly separate from our content.
          </p>
          <p>
            Some articles link to Enhancely, a set of free medical billing tools built by our author. We link to it only where a tool is directly useful to the reader.
          </p>
          <h2>Not professional advice</h2>
          <p>
            Our content is general information to help you understand your options. It isn't legal, medical, tax or financial advice. For decisions about your specific situation, contact your insurer, provider, a licensed professional, or the Texas Department of Insurance.
          </p>
        </div>
      </div>
    </>
  );
}
