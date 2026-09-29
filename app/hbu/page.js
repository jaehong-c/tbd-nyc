"use client";

import { useEffect, useMemo, useState } from "react";
import { runHbu, ASSUMPTIONS } from "@/lib/hbu/engine";
import BuildingForm, { SAMPLE_BUILDING } from "@/components/hbu/BuildingForm";
import Programs from "@/components/hbu/Programs";
import Comparison from "@/components/hbu/Comparison";
import ScenarioCard from "@/components/hbu/ScenarioCard";
import AssumptionsPanel from "@/components/hbu/AssumptionsPanel";
import MemoPanel from "@/components/hbu/MemoPanel";

const EMPTY_BUILDING = {
  address: "",
  submarket: "",
  grossSF: "",
  floors: "",
  typicalFloorSF: "",
  yearBuilt: "",
  zoning: "",
  taxesPSF: "",
  acquisitionBasis: "",
  manhattanBelow96: true,
  residentialPermitted: true,
  currentUse: "office",
};

const LOT_KEY = "tbd.lot";

export default function HbuPage() {
  const [building, setBuilding] = useState(SAMPLE_BUILDING);
  const [overrides, setOverrides] = useState({});
  const [rankBy, setRankBy] = useState("residual");
  const [fromZoning, setFromZoning] = useState(null);

  // A lot handed over from Zoning (localStorage) replaces the sample.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOT_KEY);
      if (!raw) return;
      const lot = JSON.parse(raw);
      if (lot && Number(lot.grossSF) > 0) {
        setBuilding({ ...SAMPLE_BUILDING, ...lot, taxesPSF: lot.taxesPSF || SAMPLE_BUILDING.taxesPSF, acquisitionBasis: "" });
        setFromZoning(lot);
      }
    } catch {}
  }, []);

  function dropLot() {
    try {
      localStorage.removeItem(LOT_KEY);
    } catch {}
    setFromZoning(null);
    setBuilding(SAMPLE_BUILDING);
  }

  const ready = Number(building.grossSF) > 0;
  const analysis = useMemo(
    () => (ready ? runHbu(building, overrides, ASSUMPTIONS, { rankBy }) : null),
    [building, overrides, rankBy, ready]
  );

  const memoPayload = analysis
    ? {
        building: analysis.building,
        comparison: analysis.comparison,
        recommendation: analysis.recommendation,
        programs: analysis.programs,
      }
    : null;

  return (
    <main className="mx-auto max-w-7xl px-6 pt-8 pb-12">
      <div className="hbu-grid">
        <aside className="hbu-sticky">
          {fromZoning && (
            <div className="card card-tight mb-3">
              <p className="eyebrow mb-1">From Zoning</p>
              <p className="text-[13px] text-[var(--ink-2)]">
                {fromZoning.address || `BBL ${fromZoning.bbl}`}. Gross SF, floors, year built and zoning came from PLUTO;
                taxes are a default and basis is blank.
              </p>
              <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={dropLot}>
                Back to sample
              </button>
            </div>
          )}
          <BuildingForm
            value={building}
            onChange={setBuilding}
            onLoadSample={() => {
              setFromZoning(null);
              setBuilding(SAMPLE_BUILDING);
            }}
          />
          {analysis && <Programs programs={analysis.programs} />}
          <button
            type="button"
            className="btn btn-ghost btn-sm mt-3"
            onClick={() => setBuilding(EMPTY_BUILDING)}
          >
            Clear
          </button>
        </aside>

        <section className="grid gap-5">
          {!analysis ? (
            <div className="card">
              <p className="eyebrow mb-1">Waiting for a building</p>
              <p className="text-[14px] text-[var(--ink-2)]">
                Enter a gross floor area on the left, or load the sample, and the three scenarios appear here.
              </p>
            </div>
          ) : (
            <>
              <Comparison
                comparison={analysis.comparison}
                recommendation={analysis.recommendation}
                rankBy={rankBy}
                onRankBy={setRankBy}
                basis={Boolean(Number(building.acquisitionBasis))}
              />

              <div className="grid gap-5 lg:grid-cols-3">
                {analysis.results.map((r) => (
                  <ScenarioCard key={r.key} result={r} isWinner={r.key === analysis.recommendation.key} building={building} />
                ))}
              </div>

              <AssumptionsPanel
                assumptions={analysis.assumptions}
                overrides={overrides}
                onChange={setOverrides}
                onReset={() => setOverrides({})}
              />

              <MemoPanel payload={memoPayload} disabled={!analysis} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
