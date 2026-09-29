"use client";

const SCENARIOS = [
  ["rental", "Multifamily rental conversion"],
  ["condo", "Condo conversion"],
  ["office", "Office repositioning"],
];

const MONEY = [
  ["acquisition", "Acquisition basis, $"],
  ["hard", "Hard cost, $"],
  ["soft", "Soft cost, $"],
  ["contingency", "Contingency, $"],
];

export default function InputsPanel({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const isCondo = value.scenario === "condo";
  const numField = (key, label, step = 1, rate = false) => {
    const shown = rate ? Math.round(Number(value[key] || 0) * 10000) / 100 : value[key] ?? "";
    return (
      <div key={key} className="input-row">
        <label htmlFor={`pf-${key}`}>{label}</label>
        <input
          id={`pf-${key}`}
          className="field-input"
          type="number"
          step={rate ? step * 100 : step}
          value={shown}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return set(key, "");
            set(key, rate ? Number(raw) / 100 : Number(raw));
          }}
        />
      </div>
    );
  };

  return (
    <div className="card">
      <p className="eyebrow mb-1">Inputs</p>
      <p className="text-[13px] text-[var(--ink-3)]">One scenario, laid out over time.</p>

      <div className="mt-3">
        <label className="field-label" htmlFor="pf-scenario">
          Scenario
        </label>
        <select
          id="pf-scenario"
          className="field-select"
          value={value.scenario}
          onChange={(e) => set("scenario", e.target.value)}
        >
          {SCENARIOS.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-[12px] font-semibold text-[var(--ink)]">Costs</div>
      {MONEY.map(([k, l]) => numField(k, l, 100000))}

      <div className="mt-4 text-[12px] font-semibold text-[var(--ink)]">Revenue</div>
      {isCondo ? (
        <>
          {numField("gdv", "Gross sellout, $", 100000)}
          {numField("salesCostPct", "Sales and closing, share of sellout", 0.005, true)}
        </>
      ) : (
        <>
          {numField("stabilizedNOI", "Stabilized NOI, $/yr", 50000)}
          {numField("exitCapRate", "Exit cap rate", 0.0025, true)}
          {numField("sellingCostPct", "Selling cost at exit", 0.005, true)}
        </>
      )}

      <div className="mt-4 text-[12px] font-semibold text-[var(--ink)]">Timeline</div>
      {numField("preConstructionMonths", "Pre-construction, months", 3)}
      {numField("constructionMonths", "Construction, months", 3)}
      {numField("absorptionMonths", isCondo ? "Sellout, months" : "Lease-up, months", 3)}

      <div className="mt-4 text-[12px] font-semibold text-[var(--ink)]">Financing</div>
      {numField("ltc", "Loan to cost", 0.05, true)}
      {numField("rate", "Interest rate, annual", 0.0025, true)}
    </div>
  );
}
