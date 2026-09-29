"use client";

import { useRouter } from "next/navigation";
import { int } from "@/lib/hbu/format";

export const LOT_KEY = "tbd.lot";

// Hands the lot card to HBU through localStorage and navigates there.
export default function SendToHbu({ a, sources }) {
  const router = useRouter();
  const card = a.lotCard;
  return (
    <div className="card">
      <p className="eyebrow mb-1">Next</p>
      <h3 className="text-[16px] leading-tight text-[var(--ink)]">Send this lot to HBU</h3>
      <p className="mt-1 text-[13px] text-[var(--ink-2)]">
        Gross SF {int(card.grossSF)}, {card.floors || "n/a"} floors, built {card.yearBuilt || "n/a"}, {card.zoning || "zoning n/a"}.
        Taxes and basis are entered there.
      </p>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={() => {
          try {
            localStorage.setItem(LOT_KEY, JSON.stringify({ ...card, savedAt: new Date().toISOString() }));
          } catch {}
          router.push("/hbu?from=zoning");
        }}
      >
        Open in HBU
      </button>

      <div className="mt-5">
        <p className="eyebrow mb-1">Sources</p>
        <ul className="source-list text-[12.5px] leading-relaxed text-[var(--ink-3)]">
          <li>
            <a href={sources.zola} target="_blank" rel="noreferrer">
              View on ZoLa (NYC Planning)
            </a>
          </li>
          <li>
            <a href={sources.pluto} target="_blank" rel="noreferrer">
              MapPLUTO record (NYC Open Data)
            </a>
            {sources.plutoVersion ? `, version ${sources.plutoVersion}` : ""}
          </li>
          {sources.geosearch && (
            <li>
              <a href={sources.geosearch} target="_blank" rel="noreferrer">
                GeoSearch match (NYC Planning Labs)
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
