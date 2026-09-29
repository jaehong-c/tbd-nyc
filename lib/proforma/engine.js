// Development pro forma: one scenario laid out over time, quarterly.
// Pure functions. Money in dollars, rates as decimals, time in quarters.
//
// Shape of the model (the Excel export uses the same formulas):
//   Q0            closing: acquisition basis
//   pre-con       design and permitting: 30% of soft cost, spread evenly
//   construction  hard + contingency on an S-curve, 70% of soft evenly
//   absorption    rental/office: NOI ramps to stabilized; condo: sellout evenly
//   exit          rental/office: sale at exit cap less selling cost
// Financing: equity first until the equity requirement (1 - LTC of total
// development cost) is met, then the loan funds costs and capitalized
// interest. Rental/office repay at exit; condo repays from net sales.

export const DEFAULTS = {
  preConstructionMonths: 6,
  constructionMonths: 24,
  absorptionMonths: 12,
  ltc: 0.6,
  rate: 0.085,
  exitCapRate: 0.05,
  sellingCostPct: 0.02,
  salesCostPct: 0.06,
  softInPreCon: 0.3,
};

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// S-curve weights over n periods: cumulative logistic, normalized to sum 1.
export function sCurveWeights(n) {
  if (n <= 0) return [];
  if (n === 1) return [1];
  const k = 8 / n;
  const mid = (n - 1) / 2;
  const cum = (i) => 1 / (1 + Math.exp(-k * (i - mid)));
  const c0 = cum(-0.5);
  const c1 = cum(n - 0.5);
  const w = [];
  let prev = c0;
  for (let i = 0; i < n; i++) {
    const c = cum(i + 0.5);
    w.push((c - prev) / (c1 - c0));
    prev = c;
  }
  return w;
}

function quarters(months) {
  return Math.max(0, Math.ceil(num(months) / 3));
}

export function irr(flows) {
  // Newton with bisection fallback on quarterly flows; returns quarterly rate.
  const npv = (r) => flows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
  let lo = -0.99;
  let hi = 1.0;
  let fLo = npv(lo);
  let fHi = npv(hi);
  if (!Number.isFinite(fLo) || !Number.isFinite(fHi) || fLo * fHi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-6) return mid;
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return (lo + hi) / 2;
}

export function annualize(q) {
  return q === null ? null : Math.pow(1 + q, 4) - 1;
}

export function runProforma(input) {
  const i = { ...DEFAULTS, ...input };
  const isCondo = i.scenario === "condo";
  const acquisition = num(i.acquisition);
  const hard = num(i.hard);
  const soft = num(i.soft);
  const contingency = num(i.contingency);

  const nPre = quarters(i.preConstructionMonths);
  const nCon = Math.max(1, quarters(i.constructionMonths));
  const nAbs = Math.max(1, quarters(i.absorptionMonths));
  const n = 1 + nPre + nCon + nAbs; // Q0 .. last
  const conStart = 1 + nPre;
  const absStart = conStart + nCon;
  const exitQ = n - 1;

  const w = sCurveWeights(nCon);
  const softPre = soft * num(i.softInPreCon);
  const softCon = soft - softPre;

  const rows = [];
  for (let q = 0; q < n; q++) {
    const inPre = q >= 1 && q < conStart;
    const inCon = q >= conStart && q < absStart;
    const inAbs = q >= absStart;
    const k = inCon ? q - conStart : -1;
    rows.push({
      q,
      phase: q === 0 ? "Closing" : inPre ? "Pre-construction" : inCon ? "Construction" : "Absorption",
      acquisition: q === 0 ? acquisition : 0,
      hard: inCon ? hard * w[k] : 0,
      contingency: inCon ? contingency * w[k] : 0,
      soft: inPre ? softPre / nPre : inCon ? softCon / nCon : 0,
      noi: 0,
      sales: 0,
      exit: 0,
    });
  }

  // Revenue
  const stabilizedNOI = num(i.stabilizedNOI);
  const gdv = num(i.gdv);
  const salesCostPct = num(i.salesCostPct);
  const exitCap = num(i.exitCapRate);
  const sellingCostPct = num(i.sellingCostPct);
  let exitValue = 0;
  for (let q = absStart; q < n; q++) {
    const j = q - absStart + 1;
    if (isCondo) {
      rows[q].sales = (gdv * (1 - salesCostPct)) / nAbs;
    } else {
      // Linear ramp: quarter j of nAbs earns j/nAbs of stabilized NOI.
      rows[q].noi = (stabilizedNOI / 4) * (j / nAbs);
    }
  }
  if (!isCondo && exitCap > 0) {
    exitValue = (stabilizedNOI / exitCap) * (1 - sellingCostPct);
    rows[exitQ].exit = exitValue;
  }

  // Financing
  const devCost = rows.reduce((s, r) => s + r.acquisition + r.hard + r.contingency + r.soft, 0);
  const ltc = num(i.ltc);
  const rateQ = num(i.rate) / 4;
  const equityReq = devCost * (1 - ltc);
  let cumCost = 0;
  let balance = 0;
  let cumEquity = 0;
  let cumDraw = 0;
  let interestTotal = 0;
  for (const r of rows) {
    const cost = r.acquisition + r.hard + r.contingency + r.soft;
    const equityRoom = Math.max(0, equityReq - cumCost);
    r.equity = Math.min(cost, equityRoom);
    cumCost += cost;
    r.interest = balance * rateQ;
    interestTotal += r.interest;
    const needsLoan = cost - r.equity + r.interest;
    r.draw = needsLoan > 0 ? needsLoan : 0;
    const balBefore = balance + r.draw;
    let repay = 0;
    if (isCondo) {
      repay = Math.min(balBefore, r.sales);
    } else if (r.q === exitQ) {
      repay = balBefore;
    }
    r.repay = repay;
    balance = balBefore - repay;
    r.balance = balance;
    cumEquity += r.equity;
    cumDraw += r.draw;
    r.revenue = r.noi + r.sales + r.exit;
    r.unlevered = -cost + r.revenue;
    r.levered = -r.equity + r.revenue - r.repay;
  }

  const totalCost = devCost + interestTotal;
  const unleveredFlows = rows.map((r) => r.unlevered);
  const leveredFlows = rows.map((r) => r.levered);
  const uIrrQ = irr(unleveredFlows);
  const lIrrQ = irr(leveredFlows);
  const equityIn = rows.reduce((s, r) => s + r.equity, 0);
  const equityOut = rows.reduce((s, r) => s + Math.max(0, r.levered), 0);
  const peakEquity = rows.reduce((m, r) => Math.max(m, r.equity), 0);
  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  const profit = revenue - totalCost;
  const yieldOnCost = !isCondo && totalCost > 0 ? stabilizedNOI / totalCost : null;
  const marginOnCost = isCondo && totalCost > 0 ? profit / totalCost : null;

  const milestones = [
    { q: 0, label: "Closing", note: acquisition ? "Acquisition funded" : "No acquisition cost entered" },
    { q: conStart, label: "Construction start", note: `${nPre ? nPre * 3 : 0} months of design and permitting before` },
    { q: conStart + Math.floor(nCon / 2), label: "Construction midpoint", note: "Peak draw quarter on the S-curve" },
    { q: absStart, label: isCondo ? "Sellout begins" : "Lease-up begins", note: "Construction complete" },
    { q: exitQ, label: isCondo ? "Sellout complete" : "Stabilized, exit", note: isCondo ? "Loan retired from sales" : `Sale at ${(exitCap * 100).toFixed(2)}% cap` },
  ];

  return {
    input: i,
    scenario: i.scenario,
    isCondo,
    quarters: n,
    rows,
    summary: {
      acquisition,
      hard,
      soft,
      contingency,
      interest: interestTotal,
      devCost,
      totalCost,
      loan: cumDraw,
      equity: equityIn,
      equityReq,
      peakEquity,
      revenue,
      exitValue,
      profit,
      unleveredIrr: annualize(uIrrQ),
      leveredIrr: annualize(lIrrQ),
      equityMultiple: equityIn > 0 ? equityOut / equityIn : null,
      yieldOnCost,
      marginOnCost,
      months: (n - 1) * 3,
    },
    capitalCalls: rows.filter((r) => r.equity > 0).map((r) => ({ q: r.q, amount: r.equity, phase: r.phase })),
    milestones,
    sourcesUses: {
      sources: [
        ["Equity", equityIn],
        ["Construction loan", cumDraw],
      ],
      uses: [
        ["Acquisition", acquisition],
        ["Hard cost", hard],
        ["Soft cost", soft],
        ["Contingency", contingency],
        ["Capitalized interest", interestTotal],
      ],
    },
  };
}

// Two-way grid: hard cost overrun x exit cap (or sellout price for condo).
export function sensitivity(input, { costSteps = [-0.1, 0, 0.1, 0.2, 0.3], priceSteps = [-0.1, -0.05, 0, 0.05, 0.1] } = {}) {
  const isCondo = input.scenario === "condo";
  const rowsOut = costSteps.map((c) => ({
    cost: c,
    cells: priceSteps.map((p) => {
      const v = { ...input, hard: num(input.hard) * (1 + c), contingency: num(input.contingency) * (1 + c) };
      if (isCondo) v.gdv = num(input.gdv) * (1 + p);
      else v.exitCapRate = num(input.exitCapRate) * (1 - p); // lower cap = higher price
      const r = runProforma(v);
      return { price: p, leveredIrr: r.summary.leveredIrr, equityMultiple: r.summary.equityMultiple };
    }),
  }));
  return { costSteps, priceSteps, rows: rowsOut, priceLabel: isCondo ? "Sellout price" : "Exit value (cap rate move)" };
}
