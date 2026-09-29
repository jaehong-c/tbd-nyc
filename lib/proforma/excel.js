// Excel workbook for a pro forma run: Inputs, CashFlow with live formulas
// that point back to Inputs, and a Summary with IRR formulas. The S-curve
// weights and phase labels are written as values because they depend on the
// quarter count; everything else recomputes in Excel when an input changes.

import ExcelJS from "exceljs";
import { runProforma } from "./engine";

const money = '"$"#,##0;[Red]-"$"#,##0';
const pct = "0.00%";

export async function buildWorkbook(input) {
  const model = runProforma(input);
  const i = model.input;
  const isCondo = model.isCondo;
  const n = model.quarters;
  const first = 2;
  const last = first + n - 1;

  const wb = new ExcelJS.Workbook();
  wb.creator = "TBD.NYC";
  wb.created = new Date();

  // ---------- Inputs ----------
  const inp = wb.addWorksheet("Inputs");
  inp.columns = [{ width: 34 }, { width: 18 }, { width: 60 }];
  const rows = [
    ["Scenario", i.scenario, "office, condo or rental"],
    ["Acquisition basis", Number(i.acquisition) || 0, "Paid at closing (Q0)"],
    ["Hard cost", Number(i.hard) || 0, "Spread on an S-curve over construction"],
    ["Soft cost", Number(i.soft) || 0, "Share in pre-construction below, remainder evenly over construction"],
    ["Contingency", Number(i.contingency) || 0, "Spread with hard cost"],
    ["Stabilized NOI", Number(i.stabilizedNOI) || 0, "Rental and office scenarios"],
    ["Gross sellout", Number(i.gdv) || 0, "Condo scenario"],
    ["Sales cost, share of sellout", Number(i.salesCostPct) || 0, "Condo"],
    ["Exit cap rate", Number(i.exitCapRate) || 0, "Rental and office"],
    ["Selling cost, share of exit value", Number(i.sellingCostPct) || 0, "Rental and office"],
    ["Loan to cost", Number(i.ltc) || 0, "Equity funds first until 1 - LTC of development cost is in"],
    ["Interest rate, annual", Number(i.rate) || 0, "Capitalized quarterly on the drawn balance"],
    ["Pre-construction quarters", Math.ceil((Number(i.preConstructionMonths) || 0) / 3), "Design and permitting"],
    ["Construction quarters", Math.max(1, Math.ceil((Number(i.constructionMonths) || 0) / 3)), ""],
    ["Absorption quarters", Math.max(1, Math.ceil((Number(i.absorptionMonths) || 0) / 3)), "Lease-up or sellout"],
    ["Soft cost share in pre-construction", Number(i.softInPreCon) || 0, ""],
    ["Construction start quarter", { formula: "1+B14" }, "Derived"],
    ["Absorption start quarter", { formula: "B18+B15" }, "Derived"],
    ["Exit quarter", { formula: "B19+B16-1" }, "Derived"],
    ["Equity requirement", { formula: "(1-B12)*SUM(CashFlow!H:H)" }, "Derived: (1 - LTC) x development cost"],
  ];
  inp.addRow(["Input", "Value", "Note"]).font = { bold: true };
  rows.forEach((r) => inp.addRow(r));
  for (const r of [3, 4, 5, 6, 7, 8, 21]) inp.getCell(`B${r}`).numFmt = money;
  for (const r of [9, 10, 11, 12, 13, 17]) inp.getCell(`B${r}`).numFmt = pct;
  // Cell map for formulas
  const C = {
    scenario: "Inputs!$B$2",
    acq: "Inputs!$B$3",
    hard: "Inputs!$B$4",
    soft: "Inputs!$B$5",
    cont: "Inputs!$B$6",
    noi: "Inputs!$B$7",
    gdv: "Inputs!$B$8",
    salesCost: "Inputs!$B$9",
    exitCap: "Inputs!$B$10",
    sellCost: "Inputs!$B$11",
    ltc: "Inputs!$B$12",
    rate: "Inputs!$B$13",
    preQ: "Inputs!$B$14",
    conQ: "Inputs!$B$15",
    absQ: "Inputs!$B$16",
    softPre: "Inputs!$B$17",
    conStart: "Inputs!$B$18",
    absStart: "Inputs!$B$19",
    exitQ: "Inputs!$B$20",
    equityReq: "Inputs!$B$21",
  };

  // ---------- CashFlow ----------
  const cf = wb.addWorksheet("CashFlow");
  const headers = [
    "Quarter", "Phase", "S-curve weight", "Acquisition", "Hard", "Contingency", "Soft", "Total cost",
    "Cumulative cost", "Equity", "Interest", "Loan draw", "Loan repay", "Loan balance",
    "NOI", "Net sales", "Exit proceeds", "Revenue", "Unlevered CF", "Levered CF",
  ];
  cf.addRow(headers).font = { bold: true };
  cf.columns = headers.map((h, idx) => ({ width: idx < 2 ? 12 : 15 }));
  const weightsByQ = {};
  model.rows.forEach((r) => {
    if (r.phase === "Construction") weightsByQ[r.q] = r.hard / (Number(i.hard) || 1);
  });

  for (let k = 0; k < n; k++) {
    const row = first + k;
    const r = model.rows[k];
    const p = (col) => `${col}${row - 1}`;
    const isFirst = k === 0;
    cf.addRow([
      r.q,
      r.phase,
      weightsByQ[r.q] || 0,
      { formula: `IF(A${row}=0,${C.acq},0)` },
      { formula: `C${row}*${C.hard}` },
      { formula: `C${row}*${C.cont}` },
      { formula: `IF(B${row}="Pre-construction",${C.soft}*${C.softPre}/MAX(1,${C.preQ}),IF(B${row}="Construction",${C.soft}*(1-${C.softPre})/${C.conQ},0))` },
      { formula: `D${row}+E${row}+F${row}+G${row}` },
      { formula: `SUM($H$${first}:H${row})` },
      { formula: `MIN(H${row},MAX(0,${C.equityReq}-(I${row}-H${row})))` },
      isFirst ? 0 : { formula: `${p("N")}*${C.rate}/4` },
      { formula: `MAX(0,H${row}-J${row}+K${row})` },
      isFirst
        ? { formula: `IF(${C.scenario}="condo",MIN(L${row},P${row}),IF(A${row}=${C.exitQ},L${row},0))` }
        : { formula: `IF(${C.scenario}="condo",MIN(${p("N")}+L${row},P${row}),IF(A${row}=${C.exitQ},${p("N")}+L${row},0))` },
      isFirst ? { formula: `L${row}-M${row}` } : { formula: `${p("N")}+L${row}-M${row}` },
      { formula: `IF(AND(${C.scenario}<>"condo",B${row}="Absorption"),${C.noi}/4*((A${row}-${C.absStart}+1)/${C.absQ}),0)` },
      { formula: `IF(AND(${C.scenario}="condo",B${row}="Absorption"),${C.gdv}*(1-${C.salesCost})/${C.absQ},0)` },
      { formula: `IF(AND(${C.scenario}<>"condo",A${row}=${C.exitQ}),${C.noi}/${C.exitCap}*(1-${C.sellCost}),0)` },
      { formula: `O${row}+P${row}+Q${row}` },
      { formula: `-H${row}+R${row}` },
      { formula: `-J${row}+R${row}-M${row}` },
    ]);
    for (const col of ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]) {
      cf.getCell(`${col}${row}`).numFmt = money;
    }
    cf.getCell(`C${row}`).numFmt = "0.000";
  }
  cf.views = [{ state: "frozen", xSplit: 2, ySplit: 1 }];

  // ---------- Summary ----------
  const sm = wb.addWorksheet("Summary");
  sm.columns = [{ width: 34 }, { width: 18 }];
  sm.addRow(["Metric", "Value"]).font = { bold: true };
  const S = [
    ["Development cost (before interest)", `SUM(CashFlow!H${first}:H${last})`, money],
    ["Capitalized interest", `SUM(CashFlow!K${first}:K${last})`, money],
    ["Total cost", `B2+B3`, money],
    ["Equity contributed", `SUM(CashFlow!J${first}:J${last})`, money],
    ["Loan drawn", `SUM(CashFlow!L${first}:L${last})`, money],
    ["Peak equity call", `MAX(CashFlow!J${first}:J${last})`, money],
    ["Revenue", `SUM(CashFlow!R${first}:R${last})`, money],
    ["Profit", `B8-B4`, money],
    ["Unlevered IRR, annual", `(1+IRR(CashFlow!S${first}:S${last}))^4-1`, pct],
    ["Levered IRR, annual", `(1+IRR(CashFlow!T${first}:T${last}))^4-1`, pct],
    ["Equity multiple", `SUMIF(CashFlow!T${first}:T${last},">0")/B5`, "0.00"],
    ["Yield on total cost (rental, office)", `IF(${C.scenario}="condo","n/a",${C.noi}/B4)`, pct],
    ["Margin on total cost (condo)", `IF(${C.scenario}="condo",B9/B4,"n/a")`, pct],
  ];
  S.forEach(([label, f, fmt], idx) => {
    const r = sm.addRow([label, { formula: f }]);
    r.getCell(2).numFmt = fmt;
  });
  sm.addRow([]);
  sm.addRow(["Generated by TBD.NYC Pro Forma. Weights and phase labels on CashFlow are values; everything else is a formula.", ""]);

  return wb;
}

export async function workbookBuffer(input) {
  const wb = await buildWorkbook(input);
  return wb.xlsx.writeBuffer();
}
