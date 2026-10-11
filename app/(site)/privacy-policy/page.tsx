import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TexasFiles collects, uses, and protects information, including cookies, advertising, our contact form and free tools.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "October 11, 2026";

export default function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Our commitment to you"
        title="Privacy Policy"
        intro="How TexasFiles collects, uses and protects information when you visit the site, use our tools or contact us."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose max-w-none">
          <p><em>Last updated: {UPDATED}</em></p>
          <p>
            TexasFiles (&quot;we&quot;, &quot;us&quot;) publishes free guides about medical bills, health insurance and medical billing at texasfiles.in. This policy explains what information we collect, how we use it, and the choices you have.
          </p>

          <h2>Information you give us</h2>
          <p>
            When you use our <Link href="/contact">contact form</Link>, we receive the name, email address and message you provide. We use it only to reply to you, to correct or improve our guides, and to keep the site secure. We never publish identifying details from your message without your explicit permission.
          </p>
          <p>
            Please don&apos;t send us medical records, insurance member ID numbers, Social Security numbers or other sensitive personal information. We don&apos;t need them to answer general questions.
          </p>

          <h2>Our free tools</h2>
          <p>
            Our <Link href="/tools">calculators and letter generator</Link> run entirely in your browser. What you type into them is not sent to us or stored by us.
          </p>

          <h2>Information collected automatically</h2>
          <p>
            Like most websites, our hosting provider automatically processes technical information such as your IP address, browser type, the pages you visit and the date and time of your visit. This is used to deliver the site, keep it secure and understand overall usage. We don&apos;t use it to identify you personally.
          </p>

          <h2>Cookies and advertising</h2>
          <p>
            TexasFiles is free to read and is supported by advertising. Third-party advertising partners may use cookies, web beacons and similar technologies to show ads on this site, measure how ads perform, and limit how often you see the same ad. Some partners may show ads based on your visits to this and other websites.
          </p>
          <p>
            Where Google serves ads, Google and its partners use cookies to serve ads based on prior visits to this and other websites. You can opt out of personalized advertising from Google at <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>, and from many other ad companies at <a href="https://optout.aboutads.info" target="_blank" rel="noopener">aboutads.info</a>.
          </p>
          <p>
            You can also block or delete cookies in your browser settings. Blocking cookies won&apos;t stop you from reading our articles.
          </p>
          <p>
            We use a small number of essential cookies of our own only for the site administrator&apos;s login. We don&apos;t use them to track readers.
          </p>

          <h2>How we share information</h2>
          <p>We do not sell or rent your personal information. We share information only:</p>
          <ul>
            <li>with service providers that host the site, store our data and deliver ads, and only as needed for them to provide those services;</li>
            <li>when required by law, or to protect the safety and security of the site and its users.</li>
          </ul>

          <h2>How long we keep information</h2>
          <p>
            We keep contact form messages only as long as they're useful for replying to you and keeping a record of corrections, and you can ask us to delete yours at any time. Server logs are kept for a limited time by our hosting provider.
          </p>

          <h2>Your choices and rights</h2>
          <p>
            You can ask us to access, correct or delete a message you sent us by writing to us through the <Link href="/contact">contact page</Link>. Depending on where you live, you may have additional rights under local privacy laws, and we will honor valid requests.
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            TexasFiles is written for adults and is not directed to children under 13. We do not knowingly collect personal information from children.
          </p>

          <h2>Links to other websites</h2>
          <p>
            Our articles link to government agencies, insurers and other sites, including Enhancely, a set of billing tools run by our author. Those sites have their own privacy policies, and we are not responsible for their practices.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &quot;last updated&quot; date at the top shows when it was last changed.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Send us a message through our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
