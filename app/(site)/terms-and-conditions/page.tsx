import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Your rights and responsibilities when using TexasFiles. Our content is for informational purposes only.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal framework"
        title="Terms and Conditions"
        intro="Understanding your rights and responsibilities when using TexasFiles. Our content is for informational purposes only."
      />
      <div className="container-page max-w-3xl py-12">
        <div className="article prose prose-lg max-w-none">
          <h2>Disclaimer of Liability</h2>
          <p>
            All content provided on TexasFiles, including articles, guides, and resources, is for general informational and educational purposes only. It is not intended to be a substitute for professional legal, medical, or financial advice. Always seek the advice of a qualified professional regarding any specific questions or concerns you may have.
          </p>
          <p>
            TexasFiles does not endorse or recommend any specific treatments, physicians, products, or procedures. We are an independent publisher and are not affiliated with any government entity, insurance company, or healthcare provider. Users are solely responsible for verifying information with their own providers and for any actions taken based on the content of this site.
          </p>
        </div>
      </div>
    </>
  );
}
