import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Free Medical Billing & Health Insurance Tools",
  description: "Free tools to compare health plan costs and write insurance appeal letters, plus coding tools for billing teams.",
  alternates: { canonical: "/tools" },
};

const tools = [
  { href: "/tools/out-of-pocket-calculator", title: "Out-of-Pocket Cost Calculator", body: "Compare two health plans by total yearly cost in a healthy year, your expected year, and a worst-case year." },
  { href: "/tools/appeal-letter-generator", title: "Appeal Letter Generator", body: "Create an organized internal appeal letter for a denied claim, tailored to the denial reason. Copy or print." },
  { href: "https://www.enhancely.in/claim-scrubber", title: "Claim Scrubber (Enhancely)", body: "For billing teams: check CPT/HCPCS codes, modifiers and units against NCCI edits and MUEs before submitting.", external: true },
  { href: "https://www.enhancely.in/icd10-intelligence", title: "ICD-10-CM Code Lookup (Enhancely)", body: "Search ICD-10-CM diagnosis codes in real time to check what a code on your bill means.", external: true },
];

export default function Tools() {
  return (
    <>
      <PageHero eyebrow="Free tools" title="Tools for patients and billing teams" intro="Simple, free tools that run in your browser. Nothing you enter is stored." />
      <section className="container-page grid gap-5 py-12 md:grid-cols-2">
        {tools.map((t) => {
          const inner = (
            <>
              <h2 className="font-serif text-2xl font-semibold text-ink group-hover:text-accent">{t.title}{t.external ? " ↗" : ""}</h2>
              <p className="mt-2 text-ink-soft">{t.body}</p>
            </>
          );
          return t.external ? (
            <a key={t.href} href={t.href} target="_blank" rel="noopener" className="group rounded-2xl border border-line bg-card p-6 hover:shadow-lg hover:shadow-ink/5">{inner}</a>
          ) : (
            <Link key={t.href} href={t.href} className="group rounded-2xl border border-line bg-card p-6 hover:shadow-lg hover:shadow-ink/5">{inner}</Link>
          );
        })}
      </section>
    </>
  );
}
