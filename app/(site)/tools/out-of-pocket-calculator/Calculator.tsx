"use client";

import { useMemo, useState } from "react";

type Plan = { name: string; premium: number; deductible: number; coinsurance: number; oopMax: number; copay: number };

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function yearCost(p: Plan, bills: number, visits: number) {
  const copays = visits * p.copay;
  const ded = Math.min(bills, p.deductible);
  const coins = Math.max(0, bills - p.deductible) * (p.coinsurance / 100);
  const outOfPocket = Math.min(ded + coins + copays, p.oopMax);
  const premiums = p.premium * 12;
  return { premiums, outOfPocket, total: premiums + outOfPocket, hitMax: ded + coins + copays >= p.oopMax };
}

function Field({ label, value, onChange, prefix, suffix, help }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string; help?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink">{label}</span>
      <span className="mt-1 flex items-center rounded-lg border border-line bg-white focus-within:border-ink">
        {prefix && <span className="pl-3 text-muted">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          className="w-full min-w-0 bg-transparent px-3 py-2 outline-none"
        />
        {suffix && <span className="pr-3 text-muted">{suffix}</span>}
      </span>
      {help && <span className="mt-1 block text-xs text-muted">{help}</span>}
    </label>
  );
}

function PlanForm({ plan, set }: { plan: Plan; set: (p: Plan) => void }) {
  const u = (k: keyof Plan) => (v: number) => set({ ...plan, [k]: v });
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-5">
      <input
        value={plan.name}
        onChange={(e) => set({ ...plan, name: e.target.value.slice(0, 30) })}
        className="w-full border-b border-line bg-transparent pb-1 font-serif text-xl font-semibold text-ink outline-none focus:border-ink"
        aria-label="Plan name"
      />
      <Field label="Monthly premium" prefix="$" value={plan.premium} onChange={u("premium")} />
      <Field label="Deductible" prefix="$" value={plan.deductible} onChange={u("deductible")} />
      <Field label="Coinsurance (your share)" suffix="%" value={plan.coinsurance} onChange={(v) => u("coinsurance")(Math.min(100, v))} />
      <Field label="Out-of-pocket maximum" prefix="$" value={plan.oopMax} onChange={u("oopMax")} />
      <Field label="Office visit copay" prefix="$" value={plan.copay} onChange={u("copay")} help="Enter 0 if visits go toward the deductible instead." />
    </div>
  );
}

export default function Calculator() {
  const [a, setA] = useState<Plan>({ name: "Plan A", premium: 350, deductible: 7500, coinsurance: 20, oopMax: 9000, copay: 50 });
  const [b, setB] = useState<Plan>({ name: "Plan B", premium: 520, deductible: 1500, coinsurance: 20, oopMax: 5000, copay: 30 });
  const [bills, setBills] = useState(5000);
  const [visits, setVisits] = useState(4);

  const rows = useMemo(() => {
    const scen = [
      { label: "Healthy year", bills: 0, visits: 1 },
      { label: "Your estimate", bills, visits },
      { label: "Worst case", bills: 1e9, visits },
    ];
    return scen.map((s) => ({ ...s, a: yearCost(a, s.bills, s.visits), b: yearCost(b, s.bills, s.visits) }));
  }, [a, b, bills, visits]);

  const est = rows[1];
  const cheaper = est.a.total === est.b.total ? null : est.a.total < est.b.total ? a.name : b.name;
  const diff = Math.abs(est.a.total - est.b.total);

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <PlanForm plan={a} set={setA} />
        <PlanForm plan={b} set={setB} />
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2">
        <Field label="Expected covered medical bills this year (in-network, excluding copay visits)" prefix="$" value={bills} onChange={setBills} help="Tests, imaging, procedures, hospital care. Use your plan's allowed amounts if you know them." />
        <Field label="Expected office visits with a copay" value={visits} onChange={(v) => setVisits(Math.round(v))} />
      </div>

      <div className="rounded-2xl bg-ink p-6 text-white" role="status" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Result for your estimate</p>
        <p className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
          {cheaper ? <>{cheaper} costs about {usd(diff)} less this year</> : <>Both plans cost about the same</>}
        </p>
        <p className="mt-2 text-sm text-white/70">Total yearly cost = 12 months of premiums + what you pay for care, capped at the out-of-pocket maximum.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3">Scenario</th>
              <th className="px-4 py-3">{a.name}</th>
              <th className="px-4 py-3">{b.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="px-4 py-3 font-medium text-ink">{r.label}</td>
                {[r.a, r.b].map((c, i) => (
                  <td key={i} className="px-4 py-3">
                    <span className="font-semibold text-ink">{usd(c.total)}</span>
                    <span className="block text-xs text-muted">
                      {usd(c.premiums)} premiums + {usd(c.outOfPocket)} care{c.hitMax ? " (max reached)" : ""}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        Estimates only. Real costs depend on your plan's rules: some services skip the deductible, preventive care is often free, prescriptions may have separate tiers, and out-of-network care may not count toward the maximum. Check your Summary of Benefits and Coverage.
      </p>
    </div>
  );
}
