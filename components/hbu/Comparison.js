import { money, pct, int, psf, monthsLabel } from "@/lib/hbu/format";

// Side by side, one row per metric, the recommended column emphasized.
export default function Comparison({ comparison, recommendation, rankBy, onRankBy, basis }) {
  const cols = comparison;
  const rows = [
    ["Units", (c) => (c.units ? int(c.units) : "n/a")],
    ["Net operating income", (c) => (c.noi === null ? "n/a" : money(c.noi))],
    ["Cap rate", (c) => (c.capRate === null ? "n/a" : pct(c.capRate))],
    ["Stabilized value or sellout", (c) => money(c.value)],
    ["Conversion or repositioning cost", (c) => money(c.cost)],
    ["Yield on cost (margin for condo)", (c) => (c.yieldOnCost === null ? (c.marginOnCost !== null ? pct(c.marginOnCost) : "n/a") : pct(c.yieldOnCost))],
    ["Land residual", (c) => money(c.residual)],
    ["Land residual, $/SF", (c) => psf(c.residualPSF)],
    ["Time to stabilization", (c) => monthsLabel(c.monthsToStabilize)],
  ];
  if (basis) {
    rows.push(["Residual less basis", (c) => (c.vsBasis === null ? "n/a" : money(c.vsBasis))]);
    rows.push(["Yield on total cost incl. basis", (c) => (c.yieldOnTotalCost === null ? "n/a" : pct(c.yieldOnTotalCost))]);
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Comparison</p>
          <h2 className="text-[20px] leading-tight text-[var(--ink)]">
            {recommendation.label}
          </h2>
          <p className="mt-1 max-w-[60ch] text-[13px] text-[var(--ink-2)]">{recommendation.reasons.join(" ")}</p>
        </div>
        <div className="module-toggle" role="tablist" aria-label="Ranking rule">
          <button
            type="button"
            role="tab"
            aria-selected={rankBy === "residual"}
            className={`module-toggle-item${rankBy === "residual" ? " is-active" : ""}`}
            onClick={() => onRankBy("residual")}
          >
            Land residual
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={rankBy === "valueOverCost"}
            className={`module-toggle-item${rankBy === "valueOverCost" ? " is-active" : ""}`}
            onClick={() => onRankBy("valueOverCost")}
          >
            Value over cost
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="hbu-table">
          <thead>
            <tr>
              <th></th>
              {cols.map((c) => (
                <th key={c.key} className={c.key === recommendation.key ? "is-winner" : ""}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label}>
                <td>{label}</td>
                {cols.map((c) => (
                  <td key={c.key} className={c.key === recommendation.key ? "is-winner" : ""}>
                    {fn(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-[var(--ink-3)]">{recommendation.rule}</p>
    </div>
  );
}
