import { money, pct, int, psf, monthsLabel } from "@/lib/hbu/format";

// One scenario: the headline figures, then the line items that produced them.
export default function ScenarioCard({ result, isWinner }) {
  const r = result;
  const headline =
    r.key === "condo"
      ? [
          ["Gross sellout", money(r.gdv)],
          ["Total cost", money(r.cost)],
          ["Margin on cost", pct(r.marginOnCost)],
        ]
      : [
          ["NOI", money(r.noi)],
          ["Value at " + pct(r.capRate), money(r.value)],
          ["Yield on cost", pct(r.yieldOnCost)],
        ];

  return (
    <div className={`card scenario-card is-${r.key}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">{r.label}</p>
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
    </div>
  );
}
