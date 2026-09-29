"use client";

// The building card: what the engine needs to know about the asset. Every
// field maps to one input of runHbu(); the sample loads the 305 East 46th
// Street case the engine was calibrated against.

export const SAMPLE_BUILDING = {
  address: "305 East 46th Street, New York, NY 10017",
  submarket: "Midtown East (Turtle Bay)",
  grossSF: 153689,
  floors: 16,
  typicalFloorSF: 9600,
  yearBuilt: 1928,
  zoning: "C1-9 (R10 equivalent), BBL 1-1339-5",
  taxesPSF: 15,
  acquisitionBasis: 30000000,
  manhattanBelow96: true,
  residentialPermitted: true,
  currentUse: "office",
};

const FIELDS = [
  ["address", "Address", "text", "Street address"],
  ["submarket", "Submarket", "text", "e.g. Midtown East"],
  ["grossSF", "Gross SF", "number", "Building gross floor area"],
  ["floors", "Floors", "number", ""],
  ["typicalFloorSF", "Typical floor SF", "number", ""],
  ["yearBuilt", "Year built", "number", "Drives 467-m and City of Yes eligibility"],
  ["zoning", "Zoning", "text", "e.g. C5-3 (R10)"],
  ["taxesPSF", "Real estate taxes, $/SF/yr", "number", "Full taxes before any exemption"],
  ["acquisitionBasis", "Acquisition basis, $", "number", "Optional: price paid or asked, for the residual test"],
];

export default function BuildingForm({ value, onChange, onLoadSample }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Building</p>
          <p className="text-[13px] text-[var(--ink-3)]">What the engine needs to know.</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onLoadSample}>
          Load sample
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {FIELDS.map(([key, label, type, hint]) => (
          <div key={key}>
            <label className="field-label" htmlFor={`b-${key}`}>
              {label}
            </label>
            <input
              id={`b-${key}`}
              className="field-input"
              type={type}
              inputMode={type === "number" ? "decimal" : undefined}
              value={value[key] ?? ""}
              onChange={(e) => set(key, type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
              placeholder={hint}
            />
          </div>
        ))}

        <label className="flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
          <input
            type="checkbox"
            checked={value.manhattanBelow96 !== false}
            onChange={(e) => set("manhattanBelow96", e.target.checked)}
          />
          Manhattan below 96th Street
        </label>
        <label className="flex items-center gap-2 text-[13px] text-[var(--ink-2)]">
          <input
            type="checkbox"
            checked={value.residentialPermitted !== false}
            onChange={(e) => set("residentialPermitted", e.target.checked)}
          />
          District permits residential use
        </label>
      </div>
    </div>
  );
}
