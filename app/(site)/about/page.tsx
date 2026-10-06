import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Our Mission",
  description:
    "TexasFiles publishes plain-English guides, written by a medical billing specialist, to help Texans understand medical bills, health insurance, and their rights.",
  alternates: { canonical: "/about" },
};

const values = [
  ["Written from the billing side", "Our guides come from day-to-day work on insurance claims, denials, and appeals, so they explain what actually happens to a bill after a visit."],
  ["Official sources first", "We check rules against primary sources such as CMS, HealthCare.gov, and the Texas Department of Insurance, and link to them so you can verify."],
  ["Kept up to date", "Insurance rules change every year. We update articles when they do and show the date on every guide."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Our foundation"
        title="Unmasking Medical Debt. Empowering Texans."
        intro="TexasFiles publishes plain-English guides to help you understand medical bills, health insurance, and your rights as a patient in Texas."
      />

      <section className="container-page grid gap-12 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">The origin</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Why TexasFiles exists</h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              Medical bills and insurance rules are confusing, and that confusion costs patients money: surprise bills, denied claims, and charges nobody explains.
            </p>
            <p>
              TexasFiles is written by someone who works on the other side of those bills every day. The goal is simple: explain how billing and insurance really work, in plain English, so you can ask the right questions and push back when something is wrong.
            </p>
          </div>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink-soft">
            Contact us
          </Link>
        </div>

        <div id="author" className="scroll-mt-24 rounded-3xl bg-ink p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">About the author</p>
          <h3 className="mt-3 font-serif text-2xl font-semibold">{site.author.name}, {site.author.role}</h3>
          <p className="mt-4 leading-relaxed text-white/80">{site.author.bio}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Articles are general information, not legal, medical, or financial advice. For your own situation, check with your insurer, your provider’s billing office, or the Texas Department of Insurance.
          </p>
        </div>
      </section>

      <section className="container-page">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Our standards</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">How we write our guides</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Spotted a mistake or an outdated rule? <Link className="font-semibold text-accent" href="/contact">Tell us</Link> and we’ll correct it.
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
