"use client";

import { useState } from "react";
import Working from "@/components/shell/Working";

export default function ExportButton({ input }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/proforma/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tbd-nyc-proforma-${input.scenario}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="card">
      <p className="eyebrow mb-1">Excel</p>
      <p className="text-[13px] text-[var(--ink-2)]">
        Three sheets: Inputs, CashFlow, Summary. Every cash flow cell is a formula pointing back to Inputs, so the model can be audited and extended in Excel.
      </p>
      <button type="button" className="btn btn-primary mt-3" onClick={download} disabled={busy}>
        {busy ? "Building workbook" : "Download .xlsx"}
      </button>
      {busy && <Working label="Building the workbook." hint="Usually a few seconds." />}
      {error && <p className="mt-2 text-[13px] text-[var(--tier-3)]">{error}</p>}
    </div>
  );
}
