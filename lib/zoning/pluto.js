// One tax lot from MapPLUTO on NYC Open Data (Socrata dataset 64uk-42ks).
// Public, no key for light use. Numbers arrive as strings; parsed here once.

const DATASET = "https://data.cityofnewyork.us/resource/64uk-42ks.json";
const UA = "TBD.NYC/1.0 (+https://tobedeveloped.vercel.app)";

const NUM_FIELDS = [
  "lotarea", "bldgarea", "comarea", "resarea", "officearea", "retailarea", "garagearea",
  "strgearea", "factryarea", "otherarea", "numbldgs", "numfloors", "unitsres", "unitstotal",
  "lotfront", "lotdepth", "yearbuilt", "yearalter1", "yearalter2", "builtfar", "residfar",
  "commfar", "facilfar", "assessland", "assesstot", "latitude", "longitude",
];

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function fetchPluto(bbl) {
  const url = `${DATASET}?${new URLSearchParams({ bbl: String(bbl), $limit: "1" }).toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) throw new Error(`PLUTO ${res.status}`);
  const rows = await res.json();
  const r = rows?.[0];
  if (!r) return null;
  const out = { ...r };
  for (const k of NUM_FIELDS) out[k] = num(r[k]);
  return { record: out, source: url };
}

export function zolaUrl(bbl) {
  const s = String(bbl);
  return `https://zola.planning.nyc.gov/l/lot/${Number(s.slice(0, 1))}/${Number(s.slice(1, 6))}/${Number(s.slice(6, 10))}`;
}
