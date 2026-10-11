"use client";

import { useMemo, useState } from "react";

const reasons: Record<string, { label: string; argument: string; docs: string[] }> = {
  necessity: {
    label: "Not medically necessary",
    argument:
      "My treating provider determined that this care was medically necessary for my condition. As explained in the enclosed letter of medical necessity and medical records, [briefly describe your condition, symptoms, and why this treatment was needed, including any treatments that were tried first and did not work].",
    docs: ["Letter of medical necessity from my provider", "Relevant office notes and test results"],
  },
  priorauth: {
    label: "No prior authorization",
    argument:
      "I understand the claim was denied because prior authorization was not on file. [Explain what happened: for example, the provider's office submitted the request on DATE (reference number), the service was urgent, or I was not told authorization was required.] The service was medically necessary, as shown in the enclosed records, and I ask that you review the claim on its medical merits or grant a retroactive authorization.",
    docs: ["Any authorization reference number or correspondence", "Medical records supporting the service"],
  },
  network: {
    label: "Out-of-network provider",
    argument:
      "I understand the claim was processed as out-of-network. [Explain why in-network rates should apply: for example, this was emergency care; I received care at an in-network facility and did not choose this provider; or your provider directory listed this provider as in-network on DATE.] Under the federal No Surprises Act and applicable Texas law, I ask that this claim be reprocessed with in-network cost-sharing.",
    docs: ["Screenshot or printout of the provider directory listing (if applicable)", "Explanation of Benefits for this claim"],
  },
  coding: {
    label: "Billing or coding error",
    argument:
      "I believe this denial resulted from a billing or coding error. [Describe the error, for example an incorrect code, date of service, or patient information.] The provider has been asked to submit a corrected claim, and I ask that you reprocess the claim once the correction is received.",
    docs: ["Itemized bill", "Explanation of Benefits for this claim"],
  },
  excluded: {
    label: "Not covered / experimental",
    argument:
      "I understand the claim was denied as a non-covered or experimental service. I disagree because [explain why: for example, my plan documents cover this service under SECTION, or the treatment is accepted standard care for my condition, as shown in the enclosed clinical guidelines and provider letter].",
    docs: ["Relevant pages of my plan documents", "Letter from my provider with supporting clinical guidelines"],
  },
  other: {
    label: "Other reason",
    argument: "[Explain in your own words why you believe the denial is incorrect, responding directly to the reason given in the denial letter.]",
    docs: ["Explanation of Benefits for this claim"],
  },
};

const input = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink";

export default function Generator() {
  const [f, setF] = useState({
    name: "", memberId: "", claim: "", dos: "", provider: "", insurer: "", denialDate: "", reason: "necessity", amount: "",
  });
  const [copied, setCopied] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value.slice(0, 120) });
  const v = (s: string, ph: string) => s.trim() || `[${ph}]`;
  const r = reasons[f.reason];

  const letter = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    return `${today}

${v(f.insurer, "Insurance company name")}
Attn: Appeals Department
[Appeals mailing address or fax from your denial letter]

RE: Request for internal appeal
Member name: ${v(f.name, "Your full name")}
Member ID: ${v(f.memberId, "Member ID")}
Claim number: ${v(f.claim, "Claim number")}
Date of service: ${v(f.dos, "Date of service")}
Provider: ${v(f.provider, "Provider or facility name")}${f.amount.trim() ? `\nAmount in dispute: $${f.amount.trim()}` : ""}

To whom it may concern:

I am writing to request an internal appeal of the denial of the claim listed above, which I was notified of on ${v(f.denialDate, "date of denial letter")}. The stated reason for the denial was: ${r.label.toLowerCase()}.

${r.argument}

I request that you reverse the denial and process this claim for payment according to my plan's benefits. Please also send me, free of charge, copies of all documents, records, and clinical criteria used to make this decision.

Enclosed are:
${["A copy of the denial letter", ...r.docs].map((d) => `- ${d}`).join("\n")}

Please contact me at [phone number / email] if you need any additional information. I look forward to your written decision within the time frame required for my plan.

Sincerely,

${v(f.name, "Your full name")}
[Signature]`;
  }, [f, r]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="space-y-3 rounded-2xl border border-line bg-card p-5 print:hidden">
        <label className="block text-sm font-medium text-ink">Denial reason
          <select value={f.reason} onChange={set("reason")} className={input}>
            {Object.entries(reasons).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">Your name<input value={f.name} onChange={set("name")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Insurance company<input value={f.insurer} onChange={set("insurer")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Member ID<input value={f.memberId} onChange={set("memberId")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Claim number<input value={f.claim} onChange={set("claim")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Date of service<input value={f.dos} onChange={set("dos")} className={input} placeholder="e.g. 08/14/2026" /></label>
        <label className="block text-sm font-medium text-ink">Provider or facility<input value={f.provider} onChange={set("provider")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Date of denial letter<input value={f.denialDate} onChange={set("denialDate")} className={input} /></label>
        <label className="block text-sm font-medium text-ink">Amount in dispute (optional)<input value={f.amount} onChange={set("amount")} className={input} inputMode="decimal" /></label>
        <p className="text-xs text-muted">Everything stays in your browser. Nothing is saved or sent.</p>
      </div>
      <div>
        <div className="mb-3 flex flex-wrap gap-2 print:hidden">
          <button onClick={copy} className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft">{copied ? "Copied!" : "Copy letter"}</button>
          <button onClick={() => window.print()} className="rounded-lg border border-line bg-white px-4 py-2 text-sm hover:border-ink">Print</button>
        </div>
        <pre className="whitespace-pre-wrap rounded-2xl border border-line bg-white p-6 font-serif text-[15px] leading-relaxed text-ink">{letter}</pre>
        <p className="mt-3 text-xs text-muted print:hidden">
          Replace every [bracketed] section with your own details before sending. This template is general information, not legal advice. Check your denial letter for the deadline and where to send appeals.
        </p>
      </div>
    </div>
  );
}
