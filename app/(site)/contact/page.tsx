import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a confusing medical bill? Share your story with the TexasFiles investigative team. Media inquiries and collaboration requests are also welcome.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  ["What we cover", "We focus on surprise billing, out-of-network charges, and complex insurance denials specific to Texas regulations."],
  ["Source protection", "Your privacy is paramount. We never share your personal details without explicit consent."],
  ["Our editorial process", "We investigate every credible submission to provide actionable, plain-English insights for our readers."],
];

export default function Contact() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Share your story</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Unmasking Medical Debt <span className="text-accent">Together</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Have a confusing medical bill? Share your story with our investigative team. We break down the codes and appeal processes. Media inquiries and collaboration requests are also welcome.
            </p>
            <p className="mt-6 text-sm text-muted">
              Prefer email? <a className="font-semibold text-accent" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="container-page py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Your questions answered</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">How we work</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {faqs.map(([t, b]) => (
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
