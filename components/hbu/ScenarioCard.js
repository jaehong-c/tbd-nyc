"use client";

import { useRouter } from "next/navigation";
import { money, pct, int, psf, monthsLabel } from "@/lib/hbu/format";

export const PROFORMA_KEY = "tbd.proforma";

// One scenario: the headline figures, the line items that produced them,
// and a hand-off to Pro Forma carrying this scenario's numbers.
export default function ScenarioCard({ result, isWinner, building }) {
  const r = result;
  const router = useRouter();
  const headline =
    r.key === "condo"
      ? [
          ["Gross sellout", money(r.gdv)],
          ["Total cost", money(r.cost)],
          ["Margin", pct(r.marginOnCost)],
        ]
      : [
          ["NOI", money(r.noi)],
          ["Value at " + pct(r.capRate), money(r.value)],
          ["Yield on cost", pct(r.yieldOnCost)],
        ];

  function underwrite() {
    const payload = {
      scenario: r.key,
      label: r.label,
      address: building?.address || "",
      acquisition: Number(building?.acquisitionBasis) || 0,
      hard: r.costs?.hard || 0,
      soft: r.costs?.soft || 0,
      contingency: r.costs?.contingency || 0,
      stabilizedNOI: r.noi || 0,
      gdv: r.gdv || 0,
      salesCostPct: r.salesCostPct || 0,
      exitCapRate: r.capRate || 0,
      constructionMonths: r.timeline?.constructionMonths || 24,
      absorptionMonths: r.timeline?.absorptionMonths || 12,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PROFORMA_KEY, JSON.stringify(payload));
    } catch {}
    router.push("/proforma?from=hbu");
  }

  return (
    <div className={`card scenario-card is-${r.key}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="scenario-title">{r.label}</p>
          <p className="text-[12.5px] text-[var(--ink-3)]">
            {r.units ? `${int(r.units)} units` : `${int(r.sellableSF)} RSF`}
            {r.affordableUnits ? `, ${int(r.affordableUnits)} affordable` : ""}
            {`, ${monthsLabel(r.monthsToStabilize)} to stabilize`}
          </p>
        </div>
        {isWinner && <span className="chip chip-ink">Recommended</span>}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {headline.map(([k, v]) => (
          <div key={k}>
            <div className="text-[11.5px] text-[var(--ink-3)]">{k}</div>
            <div className="mono text-[16px] font-semibold text-[var(--ink)]">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="text-[11.5px] text-[var(--ink-3)]">Land residual</div>
        <div className="num-hero" style={{ fontSize: 28 }}>
          {money(r.residual)}
          <span className="ml-2 text-[13px] font-normal text-[var(--ink-3)]">{psf(r.residualPSF)}</span>
        </div>
      </div>

      <div className="mt-4">
        {r.lines.map(([k, v]) => (
          <div key={k} className="line-item">
            <span className="text-[13px] text-[var(--ink-2)]">{k}</span>
            <span>{money(v)}</span>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={underwrite}>
        Underwrite in Pro Forma
      </button>
    </div>
  );
}
