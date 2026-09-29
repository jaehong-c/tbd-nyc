// Single source of truth for the suite identity. Rename here and every
// header, footer, title and cover page follows.
export const BRAND = {
  name: "TBD.NYC",
  short: "TBD",
  expansion: "To Be Developed",
  tagline: "NYC repositioning feasibility suite",
  author: "Jae Chung",
  year: 2026,
  github: "https://github.com/jaehong-c",
};

// Module order is the development associate's decision path:
// what can the lot hold, what is it worth as, does it pencil, what changed.
export const MODULES = [
  {
    key: "zoning",
    href: "/zoning",
    name: "Zoning",
    nav: "Zoning",
    verb: "Check",
    question: "What can this lot become?",
    role: "Buildable envelope and program eligibility for any NYC lot",
    blurb:
      "Pulls the lot from NYC public records (PLUTO), reads its zoning district and floor area ratios, and reports unused development rights, buildable square feet by use, and which incentive and conversion programs apply.",
    stat: { value: "PLUTO", label: "live lot data" },
    tags: ["Live PLUTO data", "FAR by use", "Program flags"],
    sample: { title: "305 East 46th Street, C1-9 (R10 equivalent)", value: "10.0", unit: "res. FAR", note: "As-of-right" },
    repo: null,
    standalone: null,
  },
  {
    key: "hbu",
    href: "/hbu",
    name: "HBU",
    nav: "HBU",
    verb: "Analyze",
    question: "Which use is worth the most?",
    role: "Highest and best use across office, condo and rental scenarios",
    blurb:
      "Runs office repositioning, condo conversion and multifamily rental conversion (with 467-m) side by side: NOI, cap rate, stabilized value, conversion cost, sellout and land residual, then recommends a use with a written rationale.",
    stat: { value: "3", label: "scenarios compared" },
    tags: ["Three scenarios", "Land residual", "AI rationale"],
    sample: { title: "305 East 46th Street, rental conversion", value: "9.3%", unit: "yield on cost", note: "Recommended" },
    repo: null,
    standalone: null,
  },
  {
    key: "proforma",
    href: "/proforma",
    name: "Pro Forma",
    nav: "Pro Forma",
    verb: "Underwrite",
    question: "Does it pencil, and when?",
    role: "Phased development cash flow for the chosen scenario",
    blurb:
      "Builds a quarterly development pro forma from the winning scenario: sources and uses, construction draw, capital calls, lease-up or sellout, levered and unlevered returns, a three-way sensitivity grid and a milestone schedule, exportable to Excel with live formulas.",
    stat: { value: "IRR", label: "levered and unlevered" },
    tags: ["Quarterly cash flow", "Sensitivity grid", "Excel export"],
    sample: { title: "Rental conversion, 36-month program", value: "$57M", unit: "conversion cost", note: "Base case" },
    repo: null,
    standalone: null,
  },
  {
    key: "wire",
    href: "/wire",
    name: "NYC Wire",
    nav: "Wire",
    verb: "Read",
    question: "What changed this week?",
    role: "New York development news, sorted by topic",
    blurb:
      "Pulls the latest headlines on conversions, zoning and policy, deals and infrastructure from public news feeds, groups them by topic and drafts a short daily digest with links back to the sources.",
    stat: { value: "4", label: "topics tracked" },
    tags: ["4 topics", "Daily digest", "Source links"],
    sample: { title: "Conversions, zoning and policy, deals", value: "Today", unit: "", note: "Refreshed daily" },
    repo: null,
    standalone: null,
  },
];

export function moduleByKey(key) {
  return MODULES.find((m) => m.key === key);
}
