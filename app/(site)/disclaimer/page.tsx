import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "TexasFiles provides general information about medical bills, health insurance and medical billing. It is not legal, medical or financial advice.",
  alternates: { canonical: "/disclaimer" },
};

const UPDATED = "October 11, 2026";

export default function Disclaimer() {
  return (
    <>
      <PageHero
        eyebrow="Please read"
        title="Disclaimer"
        intro="Our guides explain how medical bills and health insurance work. They are a starting point, not a substitute for professional advice."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose max-w-none">
          <p><em>Last updated: {UPDATED}</em></p>

          <h2>General information only</h2>
          <p>
            The content on TexasFiles is for general informational and educational purposes. It is not legal, medical, financial, tax or insurance advice. Reading our articles or using our tools does not create an attorney-client, doctor-patient, advisor or any other professional relationship.
          </p>

          <h2>Not medical advice</h2>
          <p>
            We write about billing and insurance, not about diagnosis or treatment. Nothing on this site should be used to make decisions about your health care. Always talk to a qualified health care provider about medical questions, and never delay or skip care because of something you read here. In an emergency, call 911.
          </p>

          <h2>Not legal or financial advice</h2>
          <p>
            Laws, regulations and payer rules change often, and they apply differently depending on your plan, your state and your situation. For decisions with legal or financial consequences, such as a dispute, a lawsuit or a large bill, consult a licensed attorney, a financial professional, your insurer or the Texas Department of Insurance.
          </p>

          <h2>Billing and coding content</h2>
          <p>
            Our articles for billing teams describe common rules and practices. Payer contracts, provider manuals and coverage policies differ, and they take precedence over our general explanations. Always confirm codes, modifiers, deadlines and appeal requirements with the payer and current official sources before you submit a claim or appeal.
          </p>

          <h2>Tools and examples</h2>
          <p>
            Our <Link href="/tools">calculators and templates</Link> provide estimates and starting points based only on what you enter. Dollar amounts, plan details and scenarios in our articles are examples. Your actual costs and outcomes may be different.
          </p>

          <h2>Accuracy</h2>
          <p>
            We research our guides carefully and link to official sources, as explained in our <Link href="/editorial-policy">editorial policy</Link>. Even so, information can become outdated or contain errors, and we make no guarantee that it is complete or current. If you find something that&apos;s wrong, please <Link href="/contact">let us know</Link>.
          </p>

          <h2>Advertising and external links</h2>
          <p>
            TexasFiles is supported by advertising. Ads and links to other websites are not endorsements, and we aren&apos;t responsible for the content of other sites. Some articles link to Enhancely, a set of billing tools run by our author.
          </p>

          <h2>No affiliation</h2>
          <p>
            TexasFiles is independent and is not affiliated with any government agency, insurance company, hospital, health system or law firm. Names of insurers and programs are used only to identify them.
          </p>

          <p>
            By using this site, you agree to this disclaimer and to our <Link href="/terms-and-conditions">terms and conditions</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
