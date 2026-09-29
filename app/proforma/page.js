"use client";

import { useEffect, useMemo, useState } from "react";
import { runProforma, sensitivity, DEFAULTS } from "@/lib/proforma/engine";
import InputsPanel from "@/components/proforma/InputsPanel";
import Summary from "@/components/proforma/Summary";
import SourcesUses from "@/components/proforma/SourcesUses";
import CapitalCalls from "@/components/proforma/CapitalCalls";
import QuarterTable from "@/components/proforma/QuarterTable";
import Sensitivity from "@/components/proforma/Sensitivity";
import Milestones from "@/components/proforma/Milestones";
import ExportButton from "@/components/proforma/ExportButton";

const PROFORMA_KEY = "tbd.proforma";

// The 305 East 46th Street rental conversion at HBU defaults.
const SAMPLE = {
  scenario: "rental",
  label: "Multifamily rental conversion (467-m)",
  address: "305 East 46th Street, New York, NY 10017",
  acquisition: 30000000,
  hard: 44570000,
  soft: 9805000,
  contingency: 3343000,
  stabilizedNOI: 5300000,
  gdv: 0,
  salesCostPct: 0.06,
  exitCapRate: 0.05,
  sellingCostPct: DEFAULTS.sellingCostPct,
  preConstructionMonths: DEFAULTS.preConstructionMonths,
  constructionMonths: 24,
  absorptionMonths: 12,
  ltc: DEFAULTS.ltc,
  rate: DEFAULTS.rate,
};

const LABELS = {
  rental: "Multifamily rental conversion",
  condo: "Condo conversion",
  office: "Office repositioning",
};

export default function ProformaPage() {
  const [input, setInput] = useState(SAMPLE);
  const [fromHbu, setFromHbu] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFORMA_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p && p.scenario) {
        setInput({
          ...SAMPLE,
          ...p,
          sellingCostPct: p.sellingCostPct ?? DEFAULTS.sellingCostPct,
          preConstructionMonths: p.preConstructionMonths ?? DEFAULTS.preConstructionMonths,
          ltc: p.ltc ?? DEFAULTS.ltc,
          rate: p.rate ?? DEFAULTS.rate,
        });
        setFromHbu(p);
      }
    } catch {}
  }, []);

  function dropHandoff() {
    try {
      localStorage.removeItem(PROFORMA_KEY);
    } catch {}
    setFromHbu(null);
    setInput(SAMPLE);
  }

  const model = useMemo(() => runProforma(input), [input]);
  const grid = useMemo(() => sensitivity(input), [input]);
  const label = `${LABELS[input.scenario] || input.scenario}${input.address ? `, ${input.address}` : ""}`;

  return (
    <main className="mx-auto max-w-7xl px-6 pt-8 pb-12">
      <div className="pf-grid">
        <aside className="pf-sticky">
          {fromHbu && (
            <div className="card card-tight mb-3">
              <p className="eyebrow mb-1">From HBU</p>
              <p className="text-[13px] text-[var(--ink-2)]">
                {fromHbu.label}
                {fromHbu.address ? `, ${fromHbu.address}` : ""}. Costs, NOI or sellout, cap rate and timeline came across; financing is a default.
              </p>
              <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={dropHandoff}>
                Back to sample
              </button>
            </div>
          )}
          <InputsPanel value={input} onChange={setInput} />
        </aside>

        <section className="grid gap-5">
          <Summary model={model} label={label} />
          <div className="grid gap-5 lg:grid-cols-2">
            <SourcesUses model={model} />
            <Milestones model={model} />
          </div>
          <CapitalCalls model={model} />
          <Sensitivity grid={grid} base={model.summary.leveredIrr ?? 0} />
          <QuarterTable model={model} />
          <ExportButton input={input} />
        </section>
      </div>
    </main>
  );
}
