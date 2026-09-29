export default function Sensitivity({ grid, base }) {
  const fmt = (v) => (v === null || v === undefined ? "n/a" : `${(v * 100).toFixed(1)}%`);
  const tone = (v) => (v === null ? "" : v >= base + 0.02 ? "good" : v <= base - 0.02 ? "bad" : v < base ? "warn" : "");
  return (
    <div className="card">
      <p className="eyebrow mb-1">Sensitivity</p>
      <p className="text-[13px] text-[var(--ink-3)]">
        Levered IRR. Rows move hard cost and contingency; columns move {grid.priceLabel.toLowerCase()}. The outlined cell is the base case.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="pf-table grid-table">
          <thead>
            <tr>
              <th>Cost \ {grid.priceLabel}</th>
              {grid.priceSteps.map((p) => (
                <th key={p}>{p > 0 ? "+" : ""}{Math.round(p * 100)}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map((row) => (
              <tr key={row.cost}>
                <td>{row.cost > 0 ? "+" : ""}{Math.round(row.cost * 100)}%</td>
                {row.cells.map((c) => (
                  <td
                    key={c.price}
                    className={`${row.cost === 0 && c.price === 0 ? "is-base " : ""}${tone(c.leveredIrr)}`}
                  >
                    {fmt(c.leveredIrr)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
