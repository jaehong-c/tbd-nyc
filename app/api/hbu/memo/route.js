import { NextResponse } from "next/server";

export const maxDuration = 60;
const MODEL = "claude-sonnet-4-5";

function fmtMoney(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "n/a";
  return `$${(n / 1e6).toFixed(1)}M`;
}
function fmtPct(n) {
  return n === null || n === undefined || !Number.isFinite(n) ? "n/a" : `${(n * 100).toFixed(1)}%`;
}

function buildPrompt({ building, comparison, recommendation, programs }) {
  const lines = comparison
    .map(
      (c) =>
        `${c.label}: units ${c.units ?? "n/a"}, NOI ${fmtMoney(c.noi)}, cap rate ${fmtPct(c.capRate)}, value or sellout ${fmtMoney(
          c.value
        )}, cost ${fmtMoney(c.cost)}, yield on cost ${fmtPct(c.yieldOnCost)}${
          c.marginOnCost !== null && c.marginOnCost !== undefined ? `, margin on cost ${fmtPct(c.marginOnCost)}` : ""
        }, land residual ${fmtMoney(c.residual)} (${Math.round(c.residualPSF)} $/SF), months to stabilization ${c.monthsToStabilize}`
    )
    .join("\n");

  const prog = [programs.m467, programs.cityOfYes]
    .map((p) => `${p.name}: ${p.eligible === true ? "eligible" : p.eligible === false ? "not eligible" : "unknown"} (${p.reasons.join("; ")})`)
    .join("\n");

  return `You are writing the rationale section of a highest and best use memo for a New York City building. The ranking below was produced by a rule-based model; your job is to explain it to an investment committee, not to change it. Use only the figures given. Do not invent comparables, rents or costs that are not listed.

Building: ${building.address || "n/a"}, ${building.submarket || ""}. Gross SF ${building.grossSF}, ${building.floors || "n/a"} floors, built ${building.yearBuilt || "n/a"}, zoning ${building.zoning || "n/a"}. Acquisition basis ${building.acquisitionBasis ? fmtMoney(building.acquisitionBasis) : "not stated"}.

Scenario results:
${lines}

Program eligibility:
${prog}

Recommendation: ${recommendation.label}. Ranking rule: ${recommendation.rankBy === "valueOverCost" ? "value over total cost" : "highest land residual value"}. Model's reasons: ${recommendation.reasons.join(" ")}

Write four short paragraphs, 180 to 240 words total, plain prose:
1. The recommended use and the one number that decides it.
2. Why the runner-up loses, with the specific gap.
3. The assumption the answer is most sensitive to, and which direction would flip it.
4. What to verify before relying on this: two or three items.

Bold the two or three most decision-relevant figures using **double asterisks**. No headers, no bullet lists, no preamble, no sign-off. Do not use em dashes or en dashes anywhere; use commas, periods, or parentheses instead.`;
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.comparison || !body?.recommendation || !body?.building) {
    return NextResponse.json({ error: "Missing analysis payload" }, { status: 400 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Anthropic API ${res.status}: ${text.slice(0, 300)}` }, { status: 502 });
    }
    const data = await res.json();
    const memo = (data.content || [])
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();
    return NextResponse.json({ memo, model: MODEL });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
