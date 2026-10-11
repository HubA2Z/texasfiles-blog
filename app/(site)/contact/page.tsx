import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about a medical bill, an insurance denial or one of our guides? Send TexasFiles a message. Corrections and article suggestions are welcome.",
  alternates: { canonical: "/contact" },
};

const faqs = [
  ["What we cover", "Medical bills, Explanations of Benefits, health insurance plan rules, claim denials and appeals, with a focus on Texas."],
  ["Your privacy", "We use your details only to reply to you. We never publish your name or details without your explicit permission."],
  ["Corrections", "If a guide is wrong or out of date, tell us. We review every correction request and update the article."],
];

export default function Contact() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Contact us</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Questions, corrections <span className="text-accent">&amp; ideas</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Questions about a confusing bill, a denial, or one of our guides? Send us a message. We read every one, and reader questions often become new articles. Corrections and suggestions are always welcome.
            </p>
            <p className="mt-6 text-sm text-muted">
              We can't review individual bills or give legal advice, but we can point you to the right guide or agency.
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
