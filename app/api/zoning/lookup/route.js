import { NextResponse } from "next/server";
import { geosearch, parseBbl } from "@/lib/zoning/geosearch";
import { fetchPluto, zolaUrl } from "@/lib/zoning/pluto";
import { analyzeLot } from "@/lib/zoning/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// GET /api/zoning/lookup?q=<address or BBL>
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ error: "Enter an address or a borough-block-lot" }, { status: 400 });

  const steps = [];
  try {
    let bbl = parseBbl(q);
    let geo = null;
    if (!bbl) {
      geo = await geosearch(q);
      steps.push({ step: "geosearch", ok: Boolean(geo), source: geo?.source || null });
      if (!geo) return NextResponse.json({ error: `No NYC address matched "${q}"` , steps }, { status: 404 });
      if (!geo.bbl) return NextResponse.json({ error: `GeoSearch found "${geo.label}" but no tax lot for it` , steps }, { status: 404 });
      bbl = geo.bbl;
    }

    const pluto = await fetchPluto(bbl);
    steps.push({ step: "pluto", ok: Boolean(pluto), source: pluto?.source || null });
    if (!pluto) return NextResponse.json({ error: `PLUTO has no record for BBL ${bbl}`, steps }, { status: 404 });

    const analysis = analyzeLot({ record: pluto.record, geo, bbl });
    return NextResponse.json({
      query: q,
      geo,
      analysis,
      sources: {
        geosearch: geo?.source || null,
        pluto: pluto.source,
        zola: zolaUrl(bbl),
        plutoVersion: pluto.record.version || null,
      },
      steps,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, steps }, { status: 502 });
  }
}
