import { money } from "@/lib/hbu/format";

// Equity in (ink) and loan draws (grey) by quarter, one bar pair per quarter.
export default function CapitalCalls({ model }) {
  const rows = model.rows;
  const max = Math.max(...rows.map((r) => Math.max(r.equity, r.draw)), 1);
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Capital calls and draws</p>
          <p className="text-[13px] text-[var(--ink-2)]">
            Equity first (black), then the loan (grey). Peak equity call {money(model.summary.peakEquity)}.
          </p>
        </div>
      </div>
      <div className="calls">
        {rows.map((r) => (
          <div key={r.q} className="call" title={`Q${r.q}: equity ${money(r.equity)}, draw ${money(r.draw)}`}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2, width: "100%", height: "100%" }}>
              <div className="call-bar" style={{ height: `${(r.equity / max) * 100}%` }} />
              <div className="call-bar is-loan" style={{ height: `${(r.draw / max) * 100}%` }} />
            </div>
            <div className="call-q">{r.q}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
