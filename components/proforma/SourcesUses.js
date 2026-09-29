import { money, pct } from "@/lib/hbu/format";

export default function SourcesUses({ model }) {
  const { sources, uses } = model.sourcesUses;
  const totalS = sources.reduce((a, [, v]) => a + v, 0);
  const totalU = uses.reduce((a, [, v]) => a + v, 0);
  const Col = ({ title, rows, total }) => (
    <div>
      <div className="mb-1 text-[12px] font-semibold text-[var(--ink)]">{title}</div>
      {rows.map(([k, v]) => (
        <div key={k} className="line-item">
          <span className="text-[13px] text-[var(--ink-2)]">{k}</span>
          <span className="mono text-[12.5px]">
            {money(v)} <span className="text-[var(--ink-4)]">{total ? pct(v / total, 0) : ""}</span>
          </span>
        </div>
      ))}
      <div className="line-item">
        <span className="text-[13px] font-semibold text-[var(--ink)]">Total</span>
        <span className="mono text-[12.5px] font-semibold">{money(total)}</span>
      </div>
    </div>
  );
  return (
    <div className="card">
      <p className="eyebrow mb-3">Sources and uses</p>
      <div className="grid gap-6 md:grid-cols-2">
        <Col title="Sources" rows={sources} total={totalS} />
        <Col title="Uses" rows={uses} total={totalU} />
      </div>
    </div>
  );
}
