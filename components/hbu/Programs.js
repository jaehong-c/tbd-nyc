// Program eligibility flags with the rule each one came from, so a reviewer
// can disagree with the rule rather than with the tool.
export default function Programs({ programs }) {
  const rows = [programs.m467, programs.cityOfYes];
  return (
    <div className="card mt-4">
      <p className="eyebrow mb-1">Programs</p>
      <p className="text-[13px] text-[var(--ink-3)]">Applied as written; each flag shows why.</p>
      <div className="mt-2">
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
    </div>
  );
}
