export default function ProgramFlags({ a }) {
  const rows = [a.programs.m467, a.programs.cityOfYes];
  return (
    <div className="card">
      <p className="eyebrow mb-1">Programs</p>
      <p className="text-[13px] text-[var(--ink-3)]">Applied as written from the lot record; each flag shows why.</p>
      <div className="mt-2">
        <div className="flag">
          <span className={`flag-dot ${a.residentialPermitted === true ? "is-yes" : a.residentialPermitted === false ? "is-no" : ""}`} />
          <div>
            <div className="text-[13px] font-medium text-[var(--ink)]">
              Residential use{" "}
              <span className="text-[12px] font-normal text-[var(--ink-3)]">
                {a.residentialPermitted === true ? "permitted" : a.residentialPermitted === false ? "not permitted" : "unknown"} in {a.lot.district || "this district"}
              </span>
            </div>
            <div className="mt-1 text-[12px] text-[var(--ink-3)]">
              {a.manhattanBelow96 ? "Manhattan below 96th Street (by latitude)" : "Outside Manhattan below 96th Street (by latitude)"}
            </div>
          </div>
        </div>
        {rows.map((p) => (
          <div key={p.key} className="flag">
            <span className={`flag-dot ${p.eligible === true ? "is-yes" : p.eligible === false ? "is-no" : ""}`} />
            <div>
              <div className="text-[13px] font-medium text-[var(--ink)]">
                {p.name}
                <span className="ml-2 text-[12px] font-normal text-[var(--ink-3)]">
                  {p.eligible === true ? "eligible" : p.eligible === false ? "not eligible" : "unknown"}
                  {p.key === "467m" && p.eligible !== false ? `, ${Math.round(p.exemption * 100)}% for ${p.years} years` : ""}
                </span>
              </div>
              <ul className="mt-1 text-[12px] leading-relaxed text-[var(--ink-3)]">
                {p.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {a.cautions.length > 0 && (
        <div className="mt-4">
          <p className="eyebrow mb-1">Cautions</p>
          {a.cautions.map((c) => (
            <div key={c} className="caution">
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
