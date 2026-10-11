import "server-only";
import sanitizeHtml from "sanitize-html";

const text = (html: string) =>
  sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();

// Pulls Q&A pairs out of an article's "Frequently Asked Questions" section:
// each <h3> question followed by its answer paragraphs, until the next <h2>.
export function extractFaqs(html: string): { q: string; a: string }[] {
  const start = html.search(/<h2[^>]*>\s*(frequently asked questions|faqs?)\s*<\/h2>/i);
  if (start < 0) return [];
  const rest = html.slice(start).replace(/^<h2[^>]*>.*?<\/h2>/i, "");
  const end = rest.search(/<h2[\s>]/i);
  const section = end >= 0 ? rest.slice(0, end) : rest;
  const parts = section.split(/<h3[^>]*>/i).slice(1);
  return parts
    .map((p) => {
      const [qHtml, ...aParts] = p.split(/<\/h3>/i);
      return { q: text(qHtml), a: text(aParts.join(" ")) };
    })
    .filter((f) => f.q && f.a)
    .slice(0, 10);
}
