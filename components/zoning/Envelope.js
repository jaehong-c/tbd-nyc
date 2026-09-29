import { int } from "@/lib/hbu/format";

// FAR by use as bars on one scale, with today's built area hatched over each.
export default function Envelope({ a }) {
  const { far, buildable, building, unused, lot } = a;
  const scale = Math.max(buildable.res, buildable.comm, buildable.facil, building.bldgArea, 1);
  const rows = [
    { key: "r", label: "Residential", far: far.res, sf: buildable.res, unused: unused.res },
    { key: "c", label: "Commercial", far: far.comm, sf: buildable.comm, unused: unused.comm },
    { key: "f", label: "Community facility", far: far.facil, sf: buildable.facil, unused: Math.max(0, buildable.facil - building.bldgArea) },
  ];
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Envelope</p>
          <h2 className="text-[20px] leading-tight text-[var(--ink)]">
            {unused.max > 0
              ? `${int(unused.max)} SF of unused development rights`
              : "Built out to the envelope"}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--ink-2)]">
            Lot area {int(lot.lotArea)} SF. Built FAR {far.built ? far.built.toFixed(2) : "n/a"} against a maximum of{" "}
            {Math.max(far.res, far.comm, far.facil).toFixed(2)}. Hatched bars show what stands on the lot today.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {rows.map((r) => (
          <div key={r.key} className="env-row">
            <div className="env-label">
              {r.label}
              <small>FAR {r.far ? r.far.toFixed(2) : "0"}{r.unused > 0 ? `, ${int(r.unused)} SF unused` : ""}</small>
            </div>
            <div className="env-bar" aria-hidden="true">
              <span className={`is-${r.key}`} style={{ width: `${(r.sf / scale) * 100}%` }} />
              <span className="is-built" style={{ width: `${(Math.min(building.bldgArea, r.sf) / scale) * 100}%` }} />
            </div>
            <div className="env-value">{r.sf ? `${int(r.sf)} SF` : "n/a"}</div>
          </div>
        ))}
        <div className="env-row">
          <div className="env-label">
            Built today
            <small>PLUTO building area</small>
          </div>
          <div className="env-bar" aria-hidden="true">
            <span className="is-built" style={{ width: `${(building.bldgArea / scale) * 100}%`, opacity: 0.85 }} />
          </div>
          <div className="env-value">{int(building.bldgArea)} SF</div>
        </div>
      </div>
    </div>
  );
}
