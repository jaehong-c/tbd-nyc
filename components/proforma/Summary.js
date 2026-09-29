import { money, pct } from "@/lib/hbu/format";

function Kpi({ label, value, unit }) {
  return (
    <div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {unit ? <small>{unit}</small> : null}
      </div>
    </div>
  );
}

export default function Summary({ model, label }) {
  const s = model.summary;
  const x = (n) => (n === null || n === undefined ? "n/a" : (n * 100).toFixed(1) + "%");
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Pro forma</p>
          <h2 className="text-[20px] leading-tight text-[var(--ink)]">{label}</h2>
          <p className="mt-1 text-[13px] text-[var(--ink-2)]">
            {model.quarters} quarters from closing to {model.isCondo ? "sellout" : "exit"} ({Math.round(s.months / 12 * 10) / 10} years),{" "}
            {money(s.loan)} of construction debt at {pct(model.input.ltc, 0)} loan to cost.
          </p>
        </div>
      </div>
      <div className="kpi-strip mt-5">
        <Kpi label="Total cost incl. interest" value={money(s.totalCost)} />
        <Kpi label="Equity required" value={money(s.equity)} unit={`peak call ${money(s.peakEquity)}`} />
        <Kpi label="Levered IRR" value={x(s.leveredIrr)} unit={`unlevered ${x(s.unleveredIrr)}`} />
        <Kpi label="Equity multiple" value={s.equityMultiple === null ? "n/a" : s.equityMultiple.toFixed(2) + "x"} unit={`profit ${money(s.profit)}`} />
      </div>
      <div className="kpi-strip mt-4">
        <Kpi label={model.isCondo ? "Gross sellout" : "Exit value, net"} value={money(model.isCondo ? model.input.gdv : s.exitValue)} />
        <Kpi label={model.isCondo ? "Margin on total cost" : "Yield on total cost"} value={x(model.isCondo ? s.marginOnCost : s.yieldOnCost)} />
        <Kpi label="Capitalized interest" value={money(s.interest)} />
        <Kpi label="Capital calls" value={String(model.capitalCalls.length)} unit="quarters with equity in" />
      </div>
    </div>
  );
}
