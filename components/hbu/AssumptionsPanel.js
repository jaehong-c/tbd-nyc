"use client";

// The assumption table, editable. Each row is one key in assumptions.json;
// the basis text under a group explains where the default came from. Edits
// live in page state as overrides and never touch the JSON.

const GROUPS = [
  {
    key: "office",
    title: "Office repositioning",
    rows: [
      ["marketRentPSF", "Market rent, $/RSF/yr", 1],
      ["stabilizedOccupancy", "Stabilized occupancy", 0.01],
      ["opexPSF", "Opex ex taxes, $/RSF/yr", 1],
      ["repositioningCapexPSF", "Repositioning capex, $/gross SF", 1],
      ["leasingCostPSF", "TI and commissions, $/RSF", 1],
      ["downtimeMonths", "Downtime, months", 1],
      ["capRate", "Cap rate", 0.001],
      ["profitTarget", "Buyer margin on cost", 0.01],
    ],
  },
  {
    key: "condo",
    title: "Condo conversion",
    rows: [
      ["efficiency", "Sellable / gross", 0.01],
      ["avgUnitSF", "Average unit, SF", 10],
      ["selloutPSF", "Sellout, $/sellable SF", 10],
      ["hardCostPSF", "Hard cost, $/gross SF", 5],
      ["softCostPct", "Soft cost, share of hard", 0.01],
      ["contingencyPct", "Contingency, share of hard", 0.005],
      ["salesCostPct", "Sales and closing, share of sellout", 0.005],
      ["carryPct", "Carry, share of hard plus soft", 0.005],
      ["constructionMonths", "Construction, months", 1],
      ["selloutMonths", "Sellout, months", 1],
      ["profitTarget", "Developer profit, share of sellout", 0.01],
    ],
  },
  {
    key: "rental",
    title: "Rental conversion (467-m)",
    rows: [
      ["efficiency", "Rentable / gross", 0.01],
      ["avgUnitSF", "Average unit, SF", 10],
      ["marketRentPSF", "Market rent, $/RSF/yr", 1],
      ["affordableShare", "Affordable share of units", 0.01],
      ["affordableRentPerUnitMonth", "Affordable rent, $/unit/month", 50],
      ["vacancy", "Vacancy and credit loss", 0.005],
      ["opexPSF", "Opex ex taxes, $/RSF/yr", 1],
      ["hardCostPSF", "Hard cost, $/gross SF", 5],
      ["softCostPct", "Soft cost, share of hard", 0.01],
      ["contingencyPct", "Contingency, share of hard", 0.005],
      ["carryPct", "Carry, share of hard plus soft", 0.005],
      ["constructionMonths", "Construction, months", 1],
      ["leaseUpMonths", "Lease-up, months", 1],
      ["capRate", "Cap rate", 0.001],
      ["targetYieldOnCost", "Target yield on cost (residual)", 0.001],
    ],
  },
];

function isRate(step) {
  return step < 1;
}

export default function AssumptionsPanel({ assumptions, overrides, onChange, onReset }) {
  const setVal = (group, key, raw) => {
    const next = { ...overrides, [group]: { ...(overrides[group] || {}) } };
    if (raw === "") delete next[group][key];
    else next[group][key] = Number(raw);
    onChange(next);
  };
  const touched = Object.values(overrides).some((g) => g && Object.keys(g).length);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Assumptions</p>
          <p className="text-[13px] text-[var(--ink-3)]">
            Defaults are NYC 2026 starting points. Change any and every scenario recomputes.
          </p>
        </div>
        {touched && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
            Reset to defaults
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {GROUPS.map((g) => (
          <div key={g.key}>
            <div className="mb-2 text-[13px] font-semibold text-[var(--ink)]">{g.title}</div>
            {g.rows.map(([key, label, step]) => {
              const base = assumptions[g.key][key];
              const val = overrides[g.key]?.[key];
              const shown = val !== undefined ? val : base;
              const display = isRate(step) ? Math.round(shown * 1000) / 10 : shown;
              return (
                <div key={key} className="assumption-row">
                  <label htmlFor={`a-${g.key}-${key}`}>
                    {label}
                    {val !== undefined && <span className="ml-1 text-[var(--ink-4)]">edited</span>}
                  </label>
                  <input
                    id={`a-${g.key}-${key}`}
                    className="field-input"
                    type="number"
                    step={isRate(step) ? step * 100 : step}
                    value={display}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") return setVal(g.key, key, "");
                      setVal(g.key, key, isRate(step) ? Number(raw) / 100 : raw);
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-[var(--ink-3)]">
        Rates are shown as percentages. Bases for each default are documented in lib/hbu/assumptions.json.
      </p>
    </div>
  );
}
