import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a confusing medical bill? Send TexasFiles a question about a medical bill, an insurance denial, or an article. Collaboration requests are also welcome.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  ["What we cover", "We focus on surprise billing, out-of-network charges, and complex insurance denials specific to Texas regulations."],
  ["Your privacy", "We never publish or share your personal details without your explicit consent."],
  ["How we use questions", "Common reader questions become new guides, written without any identifying details."],
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
              Have a confusing medical bill? Send us your question. We read every message and use common questions to write new plain-English guides on billing codes, denials, and appeals. Collaboration requests are also welcome.
            </p>
            <p className="mt-6 text-sm text-muted">
              We can’t give legal or medical advice about your specific case. Please don’t include policy numbers, Social Security numbers, or medical records.
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
