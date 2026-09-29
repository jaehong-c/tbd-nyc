"use client";

import { useState } from "react";
import AddressSearch from "@/components/zoning/AddressSearch";
import LotFacts from "@/components/zoning/LotFacts";
import Envelope from "@/components/zoning/Envelope";
import ProgramFlags from "@/components/zoning/ProgramFlags";
import SendToHbu from "@/components/zoning/SendToHbu";

export default function ZoningPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function lookup(q) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/zoning/lookup?q=${encodeURIComponent(q)}`);
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || `HTTP ${r.status}`);
      setData(json);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pt-8 pb-12">
      <div className="grid gap-5">
        <AddressSearch onSearch={lookup} busy={busy} />
        {error && (
          <div className="card">
            <p className="eyebrow mb-1">Lookup failed</p>
            <p className="text-[14px] text-[var(--tier-3)]">{error}</p>
            <p className="mt-2 text-[13px] text-[var(--ink-3)]">
              Try the street address with the borough name, or the borough-block-lot from ZoLa.
            </p>
          </div>
        )}
        {data && (
          <div className="zoning-grid">
            <div className="grid gap-5">
              <LotFacts a={data.analysis} />
              <Envelope a={data.analysis} />
            </div>
            <div className="grid gap-5">
              <ProgramFlags a={data.analysis} />
              <SendToHbu a={data.analysis} sources={data.sources} />
            </div>
          </div>
        )}
        {!data && !error && (
          <div className="card">
            <p className="eyebrow mb-1">How to read the result</p>
            <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
              The lot record comes live from MapPLUTO. Buildable area is lot area times the maximum FAR for each use;
              unused development rights are buildable minus what stands on the lot. Program flags apply the 467-m and
              City of Yes rules as written. Everything carries into HBU with one click.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
