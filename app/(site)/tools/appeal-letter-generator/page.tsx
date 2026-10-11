import Link from "next/link";
import type { Metadata } from "next";
import Generator from "./Generator";

export const metadata: Metadata = {
  title: "Free Health Insurance Appeal Letter Generator",
  description:
    "Create a health insurance claim denial appeal letter in minutes. Choose the denial reason (medical necessity, prior authorization, out-of-network and more), fill in your details, then copy or print.",
  alternates: { canonical: "/tools/appeal-letter-generator" },
};

export default function Page() {
  return (
    <>
      <section className="border-b border-line print:hidden">
        <div className="container-page max-w-5xl py-12 md:py-16">
          <nav className="text-xs text-muted"><Link href="/tools" className="hover:text-ink">Free tools</Link></nav>
          <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-5xl">Appeal Letter Generator</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">
            Build a clear, organized internal appeal letter for a denied health insurance claim. Pick the denial reason, fill in your claim details, and the letter updates as you type.
          </p>
        </div>
      </section>
      <div className="container-page max-w-5xl py-10">
        <Generator />
        <div className="article prose mt-12 max-w-none print:hidden">
          <h2>Tips for a stronger appeal</h2>
          <ul>
            <li><strong>Respond to the exact denial reason.</strong> Your denial letter and Explanation of Benefits state why the claim was denied. Address that reason directly.</li>
            <li><strong>Include a letter of medical necessity</strong> from your provider for medical necessity and coverage denials. It's often the most persuasive document.</li>
            <li><strong>Watch the deadline.</strong> Most plans allow 180 days from the denial notice to file an internal appeal. Check your letter.</li>
            <li><strong>Keep copies</strong> of everything you send, and send it by a trackable method.</li>
          </ul>
          <p>
            Many denials can be prevented. See <Link href="/prior-authorization-explained">prior authorization explained</Link> and <Link href="/cpt-icd-10-codes-medical-bill-explained">how to read the codes on your medical bill</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
