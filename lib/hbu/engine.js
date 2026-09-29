// HBU engine: three futures for one building, priced the same way.
// Pure functions, no I/O. All money in dollars, all rates as decimals.
// The procedure is documented in docs/hbu-method.md; the numbers live in
// assumptions.json and in whatever the user overrides on screen.

import DEFAULTS from "./assumptions.json";

export const SCENARIOS = ["office", "condo", "rental"];

// ---------- helpers ----------

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function merge(base, override) {
  if (!override) return { ...base };
  const out = { ...base };
  for (const k of Object.keys(override)) {
    if (override[k] !== undefined && override[k] !== null && override[k] !== "") out[k] = override[k];
  }
  return out;
}

function months(...parts) {
  return parts.reduce((a, b) => a + num(b), 0);
}

// ---------- program eligibility ----------

export function checkPrograms(building, assumptions = DEFAULTS) {
  const p = assumptions.programs;
  const yearBuilt = num(building.yearBuilt, null);
  const manhattanBelow96 = building.manhattanBelow96 !== false; // default true for Midtown
  const residentialPermitted = building.residentialPermitted !== false;
  const isCommercial = (building.currentUse || "office").toLowerCase() !== "residential";

  const built = yearBuilt !== null ? yearBuilt < p["467m"].cutoffYearBuilt : null;

  const m467 = {
    key: "467m",
    name: p["467m"].name,
    eligible: built === null ? null : built && residentialPermitted && isCommercial,
    exemption: manhattanBelow96 ? p["467m"].exemptionBelow96 : p["467m"].exemptionOther,
    years: manhattanBelow96 ? p["467m"].yearsBelow96 : p["467m"].yearsOther,
    reasons: [
      built === null
        ? "Year built not provided; eligibility unknown"
        : built
        ? `Built ${yearBuilt}, before the 1991 cutoff`
        : `Built ${yearBuilt}, at or after the 1991 cutoff`,
      residentialPermitted ? "District permits residential use" : "District does not permit residential use",
      isCommercial ? "Commercial use today" : "Already residential",
      manhattanBelow96
        ? "Manhattan below 96th Street: 90% exemption for 35 years"
        : "Outside Manhattan below 96th: 65% exemption for 35 years",
    ],
    rule: p["467m"].eligibility,
  };

  const coy = {
    key: "cityOfYes",
    name: p.cityOfYes.name,
    eligible: built === null ? null : built && residentialPermitted,
    reasons: [
      built === null
        ? "Year built not provided; eligibility unknown"
        : built
        ? `Built ${yearBuilt}, before the 1991 cutoff`
        : `Built ${yearBuilt}, at or after the 1991 cutoff`,
      residentialPermitted ? "District permits residential use" : "District does not permit residential use",
    ],
    rule: p.cityOfYes.eligibility,
  };

  return { m467, cityOfYes: coy };
}

// ---------- scenarios ----------

export function runOffice(building, a) {
  const gross = num(building.grossSF);
  const rentable = gross; // office RSF is reported on a rentable basis already
  const taxesPSF = building.taxesPSF ? num(building.taxesPSF) : num(a.taxesPSF);

  const gpr = rentable * num(a.marketRentPSF);
  const egi = gpr * num(a.stabilizedOccupancy);
  const opex = rentable * num(a.opexPSF);
  const taxes = rentable * taxesPSF;
  const noi = egi - opex - taxes;

  const capex = gross * num(a.repositioningCapexPSF);
  const leasing = rentable * num(a.stabilizedOccupancy) * num(a.leasingCostPSF);
  const carry = (capex + leasing) * 0.05;
  const cost = capex + leasing + carry;

  const value = noi > 0 ? noi / num(a.capRate) : 0;
  const yieldOnCost = cost > 0 ? noi / cost : 0;
  // What a buyer could pay for the building today and still earn the margin.
  const residual = value / (1 + num(a.profitTarget)) - cost;

  return {
    key: "office",
    label: a.label,
    units: null,
    sellableSF: rentable,
    gpr,
    egi,
    opex: opex + taxes,
    taxes,
    noi,
    capRate: num(a.capRate),
    value,
    cost,
    costPSF: gross ? cost / gross : 0,
    yieldOnCost,
    residual,
    residualPSF: gross ? residual / gross : 0,
    monthsToStabilize: months(a.downtimeMonths),
    costs: { hard: capex, soft: leasing, contingency: 0, carry },
    timeline: { constructionMonths: 9, absorptionMonths: num(a.downtimeMonths) },
    lines: [
      ["Gross potential rent", gpr],
      ["Effective gross income", egi],
      ["Operating expenses", -opex],
      ["Real estate taxes", -taxes],
      ["Net operating income", noi],
      ["Stabilized value", value],
      ["Repositioning capex", -capex],
      ["Leasing costs", -leasing],
      ["Carry", -carry],
      ["Land residual", residual],
    ],
  };
}

export function runCondo(building, a) {
  const gross = num(building.grossSF);
  const sellable = gross * num(a.efficiency);
  const units = Math.floor(sellable / num(a.avgUnitSF, 1));

  const gdv = sellable * num(a.selloutPSF);
  const hard = gross * num(a.hardCostPSF);
  const soft = hard * num(a.softCostPct);
  const contingency = hard * num(a.contingencyPct);
  const carry = (hard + soft) * num(a.carryPct);
  const salesCost = gdv * num(a.salesCostPct);
  const cost = hard + soft + contingency + carry + salesCost;

  const profit = gdv * num(a.profitTarget);
  const residual = gdv - cost - profit;
  const netProceeds = gdv - salesCost;
  const marginOnCost = cost > 0 ? (gdv - cost) / cost : 0;

  return {
    key: "condo",
    label: a.label,
    units,
    sellableSF: sellable,
    gdv,
    gpr: null,
    egi: null,
    noi: null,
    capRate: null,
    value: gdv,
    cost,
    costPSF: gross ? cost / gross : 0,
    yieldOnCost: null,
    marginOnCost,
    profit,
    residual,
    residualPSF: gross ? residual / gross : 0,
    monthsToStabilize: months(a.constructionMonths, a.selloutMonths),
    costs: { hard, soft, contingency, carry, salesCost },
    salesCostPct: num(a.salesCostPct),
    timeline: { constructionMonths: num(a.constructionMonths), absorptionMonths: num(a.selloutMonths) },
    lines: [
      ["Gross sellout", gdv],
      ["Sales and closing costs", -salesCost],
      ["Net proceeds", netProceeds],
      ["Hard cost", -hard],
      ["Soft cost", -soft],
      ["Contingency", -contingency],
      ["Carry", -carry],
      ["Developer profit target", -profit],
      ["Land residual", residual],
    ],
  };
}

export function runRental(building, a, programs) {
  const gross = num(building.grossSF);
  const rentable = gross * num(a.efficiency);
  const units = Math.floor(rentable / num(a.avgUnitSF, 1));
  const m467 = programs?.m467;
  const useExemption = m467 && m467.eligible !== false;
  const exemption = useExemption ? num(m467.exemption) : 0;
  const affordableShare = useExemption ? num(a.affordableShare) : 0;

  const affordableUnits = Math.round(units * affordableShare);
  const marketUnits = units - affordableUnits;
  const marketRentPerUnitMonth = (num(a.avgUnitSF) * num(a.marketRentPSF)) / 12;

  // Unit-level gross potential rent, not a blended $/SF: affordable units rent
  // at their program rent, market units at the market rent for their size.
  const gpr = marketUnits * marketRentPerUnitMonth * 12 + affordableUnits * num(a.affordableRentPerUnitMonth) * 12;
  const egi = gpr * (1 - num(a.vacancy));
  const opex = rentable * num(a.opexPSF);
  const taxesPSF = building.taxesPSF ? num(building.taxesPSF) : num(a.taxesPSF);
  const fullTaxes = rentable * taxesPSF;
  const taxes = fullTaxes * (1 - exemption);
  const noi = egi - opex - taxes;

  const hard = gross * num(a.hardCostPSF);
  const soft = hard * num(a.softCostPct);
  const contingency = hard * num(a.contingencyPct);
  const carry = (hard + soft) * num(a.carryPct);
  const cost = hard + soft + contingency + carry;

  const value = noi > 0 ? noi / num(a.capRate) : 0;
  const yieldOnCost = cost > 0 ? noi / cost : 0;
  // Max all-in basis at the target yield, less the conversion cost.
  const residual = noi / num(a.targetYieldOnCost) - cost;

  return {
    key: "rental",
    label: a.label,
    units,
    marketUnits,
    affordableUnits,
    sellableSF: rentable,
    gpr,
    egi,
    opex: opex + taxes,
    taxes,
    taxExemption: exemption,
    noi,
    capRate: num(a.capRate),
    value,
    cost,
    costPSF: gross ? cost / gross : 0,
    yieldOnCost,
    residual,
    residualPSF: gross ? residual / gross : 0,
    monthsToStabilize: months(a.constructionMonths, a.leaseUpMonths),
    costs: { hard, soft, contingency, carry },
    timeline: { constructionMonths: num(a.constructionMonths), absorptionMonths: num(a.leaseUpMonths) },
    lines: [
      ["Gross potential rent", gpr],
      ["Effective gross income", egi],
      ["Operating expenses", -opex],
      [exemption ? `Real estate taxes (${Math.round(exemption * 100)}% exempt)` : "Real estate taxes", -taxes],
      ["Net operating income", noi],
      ["Stabilized value", value],
      ["Hard cost", -hard],
      ["Soft cost", -soft],
      ["Contingency", -contingency],
      ["Carry", -carry],
      ["Land residual at target yield", residual],
    ],
  };
}

// ---------- recommendation ----------

export function recommend(results, assumptions = DEFAULTS, rankBy) {
  const band = num(assumptions.recommendation.tieBandPct, 0.05);
  const mode = rankBy || assumptions.recommendation.rankBy || "residual";
  const score = (r) => (mode === "valueOverCost" ? (r.cost > 0 ? r.value / r.cost : 0) : r.residual);
  const ranked = [...results].sort((x, y) => score(y) - score(x));
  const top = ranked[0];
  const runnerUp = ranked[1];
  const reasons = [];
  let winner = top;
  const label = mode === "valueOverCost" ? "value over total cost" : "land residual value";

  if (runnerUp && score(top) > 0 && Math.abs(score(top) - score(runnerUp)) / score(top) <= band) {
    reasons.push(`${top.label} and ${runnerUp.label} land within ${Math.round(band * 100)}% of each other on ${label}.`);
    const yTop = top.yieldOnCost ?? top.marginOnCost ?? 0;
    const yRun = runnerUp.yieldOnCost ?? runnerUp.marginOnCost ?? 0;
    if (yRun > yTop) {
      winner = runnerUp;
      reasons.push(`${runnerUp.label} wins the tie on return on cost.`);
    } else if (yRun === yTop && runnerUp.monthsToStabilize < top.monthsToStabilize) {
      winner = runnerUp;
      reasons.push(`${runnerUp.label} wins the tie on time to stabilization.`);
    } else {
      reasons.push(`${top.label} keeps the lead on return on cost.`);
    }
  } else {
    reasons.push(`${top.label} supports the highest ${label}.`);
  }
  if (mode === "residual" && winner.residual <= 0) {
    reasons.push("No scenario supports a positive land value at these assumptions; the building is worth more as is, or the assumptions need work.");
  }
  return {
    key: winner.key,
    label: winner.label,
    reasons,
    ranked: ranked.map((r) => r.key),
    rankBy: mode,
    rule: assumptions.recommendation.rule,
  };
}

// ---------- entry point ----------

// building: { address, grossSF, floors, typicalFloorSF, yearBuilt, taxesPSF,
//             acquisitionBasis, manhattanBelow96, residentialPermitted, currentUse }
// overrides: { office: {...}, condo: {...}, rental: {...} } partial assumption edits
export function runHbu(building, overrides = {}, assumptions = DEFAULTS, options = {}) {
  const a = {
    office: merge(assumptions.office, overrides.office),
    condo: merge(assumptions.condo, overrides.condo),
    rental: merge(assumptions.rental, overrides.rental),
  };
  const programs = checkPrograms(building, assumptions);
  const results = [runOffice(building, a.office), runCondo(building, a.condo), runRental(building, a.rental, programs)];
  const recommendation = recommend(results, assumptions, options.rankBy);

  const basis = num(building.acquisitionBasis, null);
  const gross = num(building.grossSF);
  const comparison = results.map((r) => ({
    key: r.key,
    label: r.label,
    units: r.units,
    noi: r.noi,
    capRate: r.capRate,
    value: r.value,
    cost: r.cost,
    yieldOnCost: r.yieldOnCost,
    marginOnCost: r.marginOnCost ?? null,
    residual: r.residual,
    residualPSF: r.residualPSF,
    monthsToStabilize: r.monthsToStabilize,
    // Against a stated basis: does the use clear it?
    vsBasis: basis !== null ? r.residual - basis : null,
    totalCostWithBasis: basis !== null ? r.cost + basis : null,
    yieldOnTotalCost: basis !== null && r.noi !== null && r.cost + basis > 0 ? r.noi / (r.cost + basis) : null,
  }));

  return {
    building: { ...building, grossSF: gross, basisPSF: basis !== null && gross ? basis / gross : null },
    assumptions: a,
    programs,
    results,
    comparison,
    recommendation,
  };
}

export { DEFAULTS as ASSUMPTIONS };
