"use client";

import { useMemo, useState } from "react";
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

export default function HbuPage() {
  const [building, setBuilding] = useState(SAMPLE_BUILDING);
  const [overrides, setOverrides] = useState({});
  const [rankBy, setRankBy] = useState("residual");

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
          <BuildingForm
            value={building}
            onChange={setBuilding}
            onLoadSample={() => setBuilding(SAMPLE_BUILDING)}
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
                  <ScenarioCard key={r.key} result={r} isWinner={r.key === analysis.recommendation.key} />
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
