import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { author } from "@/lib/author";

export const metadata: Metadata = {
  title: "About TexasFiles",
  description:
    "TexasFiles publishes plain-English guides to medical bills, health insurance and claim denials, written by a working medical billing professional.",
  alternates: { canonical: "/about" },
};

const values = [
  ["Written from billing experience", "Articles come from the problems we see every day in claim follow-up and denial work: the errors, codes and payer rules that actually cost people money."],
  ["Checked against official sources", "We base guidance on primary sources such as CMS, HealthCare.gov and the Texas Department of Insurance, and link to them so you can verify the details."],
  ["Kept up to date", "Insurance and billing rules change every year. We review articles when rules change and show the last-reviewed date on each one."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Medical bills and health insurance, explained by someone who works in billing."
        intro="TexasFiles is a free resource that explains medical bills, Explanations of Benefits, insurance plan rules and claim denials in plain English, with a focus on patients and billing teams in Texas."
      />

      <section className="container-page grid gap-12 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Why we started</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Most billing problems are fixable, if you know the rules</h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              Medical billing runs on complicated systems of codes, modifiers, networks, deductibles and appeal deadlines. A large share of the bills and denials people receive contain errors or can be challenged, but the rules are rarely explained in plain language.
            </p>
            <p>
              TexasFiles exists to close that gap. Each guide explains how a rule works, what to check, and the exact steps to take, whether you're a patient looking at a confusing bill or a biller working a denial.
            </p>
          </div>
          <Link href="/blog" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-soft">
            Browse the guides
          </Link>
        </div>
        <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Who writes TexasFiles</p>
          <h3 className="mt-3 font-serif text-2xl font-semibold">{author.name}</h3>
          <p className="text-sm text-white/60">{author.role}</p>
          <p className="mt-4 leading-relaxed text-white/80">{author.bio[0]}</p>
          <Link href={`/author/${author.slug}`} className="mt-6 inline-block text-sm font-semibold text-white underline underline-offset-4">
            Read the full bio →
          </Link>
        </div>
      </section>

      <section className="container-page">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">How we work</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Our standards</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="font-serif text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-ink-soft">
          TexasFiles is an independent site. It isn't affiliated with any insurer, hospital, government agency or law firm, and our content is general information, not legal, medical or financial advice. The site is supported by advertising. Read our{" "}
          <Link href="/editorial-policy" className="font-semibold text-accent">editorial policy</Link> and{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent">privacy policy</Link>, or{" "}
          <Link href="/contact" className="font-semibold text-accent">contact us</Link>.
        </p>
      </section>
    </>
  );
}
