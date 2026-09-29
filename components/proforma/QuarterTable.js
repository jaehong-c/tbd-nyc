import { money } from "@/lib/hbu/format";

const COLS = [
  ["Total cost", (r) => r.acquisition + r.hard + r.contingency + r.soft],
  ["Equity", (r) => r.equity],
  ["Interest", (r) => r.interest],
  ["Draw", (r) => r.draw],
  ["Repay", (r) => r.repay],
  ["Balance", (r) => r.balance],
  ["Revenue", (r) => r.revenue],
  ["Unlevered CF", (r) => r.unlevered],
  ["Levered CF", (r) => r.levered],
];

export default function QuarterTable({ model }) {
  const exitQ = model.quarters - 1;
  return (
    <div className="card">
      <p className="eyebrow mb-1">Quarterly cash flow</p>
      <p className="text-[13px] text-[var(--ink-3)]">Costs on an S-curve, equity first, interest capitalized. The Excel export carries the same rows as formulas.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="pf-table">
          <thead>
            <tr>
              <th>Q</th>
              <th>Phase</th>
              {COLS.map(([h]) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((r) => (
              <tr key={r.q} className={r.q === exitQ ? "is-exit" : ""}>
                <td>{r.q}</td>
                <td>{r.phase}</td>
                {COLS.map(([h, fn]) => {
                  const v = fn(r);
                  return (
                    <td key={h} className={v < 0 ? "neg" : ""}>
                      {v ? money(v) : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
