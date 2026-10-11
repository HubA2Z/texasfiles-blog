import Link from "next/link";
import type { Metadata } from "next";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Health Insurance Out-of-Pocket Cost Calculator (Compare 2 Plans)",
  description:
    "Free calculator: compare two health plans by total yearly cost. Enter premiums, deductibles, coinsurance, copays and out-of-pocket maximums to see your healthy-year, expected and worst-case costs.",
  alternates: { canonical: "/tools/out-of-pocket-calculator" },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Health Insurance Out-of-Pocket Cost Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-line">
        <div className="container-page max-w-4xl py-12 md:py-16">
          <nav className="text-xs text-muted"><Link href="/tools" className="hover:text-ink">Free tools</Link></nav>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-5xl">Out-of-Pocket Cost Calculator</h1>
          <p className="mt-4 text-lg text-ink-soft">
            Compare two health insurance plans by what you'd really pay in a year, not just the premium. Change any number and the results update instantly. Nothing you enter is saved or sent anywhere.
          </p>
        </div>
      </section>
      <div className="container-page max-w-4xl py-10">
        <Calculator />
        <div className="article prose mt-12 max-w-none">
          <h2>How the calculation works</h2>
          <p>
            For each plan, the calculator adds 12 months of premiums to your share of medical costs. Your share is the deductible first, then coinsurance on the rest, plus copays, and it can never go above the out-of-pocket maximum. The <strong>worst case</strong> row assumes a year with very high bills, so you pay the full maximum.
          </p>
          <p>
            New to these terms? Read <Link href="/deductible-copay-coinsurance-out-of-pocket-maximum-explained">deductibles, copays, coinsurance and out-of-pocket maximums explained</Link>, or our step-by-step guide on <Link href="/how-to-choose-health-insurance-plan-total-cost">how to choose a health insurance plan</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
