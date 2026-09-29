// Lot analysis: what a PLUTO record says the lot can hold, what stands on it
// today, and which programs the rules point to. Pure functions.

import { checkPrograms } from "@/lib/hbu/engine";
import { splitBbl } from "./geosearch";

// Building class first letter, PLUTO convention.
const CLASS_USE = {
  A: "One-family residential",
  B: "Two-family residential",
  C: "Walk-up apartments",
  D: "Elevator apartments",
  E: "Warehouse",
  F: "Factory or industrial",
  G: "Garage",
  H: "Hotel",
  I: "Hospital or health",
  J: "Theater",
  K: "Retail",
  L: "Loft",
  M: "Religious",
  N: "Asylum or home",
  O: "Office",
  P: "Cultural or public assembly",
  Q: "Recreation",
  R: "Condominium",
  S: "Mixed residential and commercial",
  T: "Transportation",
  U: "Utility",
  V: "Vacant land",
  W: "Educational",
  Y: "Government",
  Z: "Miscellaneous",
};

// 96th Street runs at about 40.7855 N on the East Side; the West Side line is
// a little higher, so this is a first-pass flag, not a legal finding.
const LAT_96TH = 40.7855;

function residentialPermitted(district) {
  const d = String(district || "").toUpperCase();
  if (!d) return null;
  if (/^R/.test(d)) return true;
  if (/^C[1-6]/.test(d)) return true;
  if (/^C[78]/.test(d)) return false;
  if (/^M/.test(d)) return false;
  return null;
}

function currentUseFor(bldgclass) {
  const c = String(bldgclass || "").toUpperCase();
  const first = c.slice(0, 1);
  const label = CLASS_USE[first] || "Unknown";
  const residential = ["A", "B", "C", "D", "R", "S"].includes(first);
  return { code: c, label, residential };
}

function num(v) {
  return Number.isFinite(v) ? v : 0;
}

export function analyzeLot({ record: p, geo, bbl }) {
  const id = splitBbl(bbl);
  const lotArea = num(p.lotarea);
  const bldgArea = num(p.bldgarea);
  const far = {
    res: num(p.residfar),
    comm: num(p.commfar),
    facil: num(p.facilfar),
    built: num(p.builtfar),
  };
  const buildable = {
    res: lotArea * far.res,
    comm: lotArea * far.comm,
    facil: lotArea * far.facil,
  };
  const maxBuildable = Math.max(buildable.res, buildable.comm, buildable.facil);
  const unusedMax = Math.max(0, maxBuildable - bldgArea);
  const unusedRes = Math.max(0, buildable.res - bldgArea);
  const unusedComm = Math.max(0, buildable.comm - bldgArea);

  const district = p.zonedist1 || "";
  const districts = [p.zonedist1, p.zonedist2, p.zonedist3, p.zonedist4].filter(Boolean);
  const overlays = [p.overlay1, p.overlay2].filter(Boolean);
  const specials = [p.spdist1, p.spdist2, p.spdist3].filter(Boolean);
  const resOk = residentialPermitted(district);
  const use = currentUseFor(p.bldgclass);
  const yearBuilt = p.yearbuilt && p.yearbuilt > 0 ? p.yearbuilt : null;
  const lat = p.latitude ?? geo?.lat ?? null;
  const manhattan = id.boroCode === 1;
  const manhattanBelow96 = manhattan && lat !== null ? lat < LAT_96TH : false;

  const programs = checkPrograms({
    yearBuilt,
    manhattanBelow96,
    residentialPermitted: resOk !== false,
    currentUse: use.residential ? "residential" : "office",
  });

  const cautions = [];
  if (p.landmark) cautions.push(`Individual landmark: ${p.landmark}. Exterior work needs LPC approval.`);
  if (p.histdist) cautions.push(`In the ${p.histdist} historic district. Exterior work needs LPC approval.`);
  if (p.ltdheight) cautions.push(`Limited height district ${p.ltdheight}.`);
  if (specials.length) cautions.push(`Special district ${specials.join(", ")}: bulk and use rules may differ from the underlying district.`);
  if (resOk === null) cautions.push(`Residential use in ${district || "this district"} could not be determined by rule; check the Zoning Resolution.`);
  if (far.built > far.res && far.res > 0) cautions.push("Built FAR exceeds the residential FAR: a conversion keeps the existing floor area only under the conversion rules, not as new construction.");
  if (!yearBuilt) cautions.push("PLUTO has no year built for this lot; program eligibility is unknown until it is confirmed.");

  const lotCard = {
    address: p.address ? `${p.address}, ${id.borough}` : geo?.label || "",
    submarket: "",
    grossSF: bldgArea || "",
    floors: p.numfloors || "",
    typicalFloorSF: p.numfloors ? Math.round(bldgArea / p.numfloors) : "",
    yearBuilt: yearBuilt || "",
    zoning: [district, overlays.length ? `overlay ${overlays.join("/")}` : "", far.res ? `res FAR ${far.res}` : ""]
      .filter(Boolean)
      .join(", "),
    taxesPSF: "",
    acquisitionBasis: "",
    manhattanBelow96,
    residentialPermitted: resOk !== false,
    currentUse: use.residential ? "residential" : "office",
    bbl: String(bbl),
  };

  return {
    bbl: String(bbl),
    id,
    address: p.address || "",
    zip: p.zipcode || "",
    lot: {
      lotArea,
      lotFront: p.lotfront,
      lotDepth: p.lotdepth,
      district,
      districts,
      overlays,
      specials,
      ltdHeight: p.ltdheight || "",
      landmark: p.landmark || "",
      histDist: p.histdist || "",
      cd: p.cd,
      council: p.council,
      owner: p.ownername || "",
      lat,
      lng: p.longitude ?? geo?.lng ?? null,
    },
    building: {
      bldgArea,
      numFloors: p.numfloors,
      numBldgs: p.numbldgs,
      yearBuilt,
      yearAltered: p.yearalter1 || null,
      bldgClass: use.code,
      use: use.label,
      residential: use.residential,
      unitsRes: p.unitsres,
      unitsTotal: p.unitstotal,
      officeArea: p.officearea,
      retailArea: p.retailarea,
      resArea: p.resarea,
      assessTotal: p.assesstot,
      assessLand: p.assessland,
    },
    far,
    buildable,
    unused: { max: unusedMax, res: unusedRes, comm: unusedComm },
    maxBuildable,
    residentialPermitted: resOk,
    manhattanBelow96,
    programs,
    cautions,
    lotCard,
  };
}
