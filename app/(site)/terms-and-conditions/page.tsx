import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for using TexasFiles, its guides and free tools. Our content is general information, not professional advice.",
  alternates: { canonical: "/terms-and-conditions" },
};

const UPDATED = "October 11, 2026";

export default function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Using this site"
        title="Terms and Conditions"
        intro="The rules for using TexasFiles, its guides and its free tools. Please read them along with our disclaimer and privacy policy."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose max-w-none">
          <p><em>Last updated: {UPDATED}</em></p>
          <p>
            By using texasfiles.in (the &quot;site&quot;), you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.
          </p>

          <h2>Information only, not professional advice</h2>
          <p>
            Everything on TexasFiles, including articles, guides, tools and examples, is general information for educational purposes. It is not legal, medical, financial, tax or insurance advice, and it doesn&apos;t create any professional relationship between you and TexasFiles or its author. Insurance plans, payer policies and laws differ and change often. Always confirm details with your insurer, your provider, your plan documents or a qualified professional before acting. See our full <Link href="/disclaimer">disclaimer</Link>.
          </p>

          <h2>Our free tools</h2>
          <p>
            Our <Link href="/tools">calculators and letter generator</Link> give estimates and templates based only on what you enter. Results are not a quote, a coverage decision or a guarantee of any outcome. You are responsible for checking and editing anything you use, including appeal letters, before you send it.
          </p>

          <h2>Accuracy and updates</h2>
          <p>
            We work to keep our content accurate and up to date, as described in our <Link href="/editorial-policy">editorial policy</Link>. Even so, we can&apos;t guarantee that every article is complete, current or free of errors. If you spot a mistake, please <Link href="/contact">tell us</Link>.
          </p>

          <h2>Acceptable use</h2>
          <p>When using the site, you agree not to:</p>
          <ul>
            <li>copy or republish our articles, images or tools in bulk without permission;</li>
            <li>scrape the site in a way that harms its performance, or try to access areas you aren&apos;t authorized to use;</li>
            <li>use the contact form to send spam, abusive messages or unlawful content.</li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            The articles, graphics and tools on TexasFiles are owned by TexasFiles unless stated otherwise. You may share links to our pages and quote short excerpts with a link back to the original article. Trademarks and names of insurers, government programs and other organizations belong to their owners and are used only to identify them.
          </p>

          <h2>Advertising and links to other websites</h2>
          <p>
            The site is supported by advertising and may show ads from third-party networks. An ad on TexasFiles is not an endorsement. Our articles also link to other websites, including government sources and Enhancely, a set of billing tools run by our author. We aren&apos;t responsible for the content, policies or practices of other websites.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            The site is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind. To the fullest extent allowed by law, TexasFiles and its author are not liable for any loss or damage arising from your use of the site, its tools or its content, or from decisions you make based on them.
          </p>

          <h2>Independence</h2>
          <p>
            TexasFiles is an independent publisher. We are not affiliated with any government agency, insurance company, hospital or law firm.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The &quot;last updated&quot; date at the top shows when they last changed. Continuing to use the site after a change means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Reach us through our <Link href="/contact">contact page</Link>. See also our <Link href="/privacy-policy">privacy policy</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
