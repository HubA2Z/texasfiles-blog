import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About Our Mission",
  description:
    "TexasFiles provides plain-English guides and investigative articles to help Texans navigate complex medical billing and insurance systems.",
  alternates: { canonical: "/about" },
};

const values = [
  ["Rigorous Research", "Our team dives deep into Texas-specific regulations and billing codes, translating complex data into clear, concise guides."],
  ["Unbiased Reporting", "We maintain strict editorial independence, delivering facts without influence from industry stakeholders."],
  ["Actionable Insights", "From deciphering Explanation of Benefits to appealing denied claims, our content provides practical steps you can take."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Our foundation"
        title="Unmasking Medical Debt. Empowering Texans."
        intro="TexasFiles provides plain-English guides and investigative articles to help you navigate complex medical billing and insurance systems."
      />

      <section className="container-page grid gap-12 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">The origin</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Why TexasFiles exists</h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              The Texas healthcare landscape is notoriously complex, often leaving residents confused and vulnerable to unfair billing practices. We recognized the urgent need for clear, unbiased information.
            </p>
            <p>
              Our founders, experienced healthcare advocates and journalists, launched TexasFiles to cut through the jargon and provide actionable strategies for consumer defense.
            </p>
          </div>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-soft">
            Contact the Editor
          </Link>
        </div>
        <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Our pledge</p>
          <h3 className="mt-3 font-serif text-2xl font-semibold">Absolute independence. Unwavering transparency.</h3>
          <p className="mt-4 leading-relaxed text-white/80">
            We accept zero funding from insurance companies, hospital groups, or pharmaceutical corporations. Our loyalty is solely to Texas residents and their right to fair, understandable healthcare.
          </p>
        </div>
      </section>

      <section className="container-page">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Our commitment</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Journalism you can trust</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Every article and guide is meticulously researched and fact-checked to ensure accuracy and actionable advice.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map(([t, b]) => (
            <div key={t} className="rounded-2xl border border-line bg-card p-6">
              <h3 className="font-serif text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
