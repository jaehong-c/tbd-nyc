// Address to borough-block-lot through NYC Planning Labs GeoSearch (v2).
// Public, no key. Returns the best match with its BBL and coordinates.

const GEOSEARCH = "https://geosearch.planninglabs.nyc/v2/search";
const UA = "TBD.NYC/1.0 (+https://tobedeveloped.vercel.app)";

const BORO_CODE = { 1: "Manhattan", 2: "Bronx", 3: "Brooklyn", 4: "Queens", 5: "Staten Island" };

// Accepts "1-1338-1", "1/1338/1", "1013380001" or "1 1338 1".
export function parseBbl(text) {
  const t = String(text || "").trim();
  if (/^\d{10}$/.test(t)) return t;
  const m = t.match(/^([1-5])[\s\-\/,]+(\d{1,5})[\s\-\/,]+(\d{1,4})$/);
  if (!m) return null;
  return `${m[1]}${m[2].padStart(5, "0")}${m[3].padStart(4, "0")}`;
}

export function splitBbl(bbl) {
  const s = String(bbl);
  return {
    boroCode: Number(s.slice(0, 1)),
    borough: BORO_CODE[Number(s.slice(0, 1))] || "",
    block: Number(s.slice(1, 6)),
    lot: Number(s.slice(6, 10)),
  };
}

export async function geosearch(text) {
  const url = `${GEOSEARCH}?${new URLSearchParams({ text, size: "1" }).toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`GeoSearch ${res.status}`);
  const data = await res.json();
  const f = data?.features?.[0];
  if (!f) return null;
  const p = f.properties || {};
  const bbl = p.addendum?.pad?.bbl || null;
  const [lng, lat] = f.geometry?.coordinates || [null, null];
  return {
    label: p.label || p.name || text,
    housenumber: p.housenumber || "",
    street: p.street || "",
    borough: p.borough || "",
    postalcode: p.postalcode || "",
    bbl,
    bin: p.addendum?.pad?.bin || null,
    lat,
    lng,
    source: url,
  };
}
