import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "About" };

function Section({ eyebrow, title, children }) {
  return (
    <section className="about-section">
      <p className="eyebrow mb-2">{eyebrow}</p>
      {title && <h2 className="about-h2">{title}</h2>}
      {children}
    </section>
  );
}

export default function AboutSuite() {
  return (
    <main className="about">
      <div className="about-wrap">
        <p className="eyebrow mb-3">About</p>
        <h1 className="about-h1">
          Why {BRAND.name} exists, and how each of its four tools works.
        </h1>

        <Section eyebrow="Why I built this">
          <p>
            I spent eight years on the design side of large projects in New York, at Bjarke Ingels Group,
            James Corner Field Operations and ODA, mostly on the front end of development: site feasibility,
            entitlements, infrastructure diligence and the coordination that turns a lot into a program. The
            part of that work I kept coming back to was the question underneath every drawing: what is this
            site actually worth as each of the things it could become? Columbia&apos;s MSRED program gave me
            the finance to answer it. This suite is where the two sides meet.
          </p>
          <p>
            The immediate origin was an interview assignment in April 2026 for a Manhattan investment sales
            team: write a highest and best use analysis of a Class B Midtown East office building as an
            automated procedure, then run it. The procedure lived as two documents, one for the method and one
            for the New York assumptions. It worked, but it was only the middle of the problem. Before the
            valuation you need to know what the zoning allows; after it you need to know whether the winning
            use pencils quarter by quarter and when the money is called. {BRAND.name} is that whole path as
            software, built on the city&apos;s own data so every number can be traced to its source.
          </p>
          <p>
            Two rules shaped it. Every figure on screen comes from a published rule over public data or from an
            assumption you can see and change, and the language model only ever writes prose about numbers it
            was given. It never produces a number itself. That is what makes the output something a reviewer can
            argue with line by line rather than a black box.
          </p>
        </Section>

        <Section eyebrow="Tool 1" title="Zoning: what the lot can hold">
          <p>
            Type a street address or a borough-block-lot. The address is resolved through NYC Planning
            Labs&apos; GeoSearch to a BBL, and the BBL is looked up live in MapPLUTO on NYC Open Data. From the
            lot record the tool reads lot area, zoning districts, overlays and special districts, the maximum
            floor area ratio for residential, commercial and community facility use, and what stands on the lot
            today: built area, floors, year built, building class, units.
          </p>
          <p>
            Buildable area is lot area times the maximum FAR for each use; unused development rights are
            buildable minus built. Program eligibility is a set of published rules applied as written, and each
            flag shows the rule it came from: 467-m (commercial building built before 1991, residential
            permitted, 25% affordable, 90% exemption for 35 years below 96th Street in Manhattan, 65% elsewhere)
            and City of Yes conversion eligibility. Landmarks, historic districts, limited height districts and
            a built FAR above the residential maximum surface as cautions. One click carries the lot into HBU.
          </p>
        </Section>

        <Section eyebrow="Tool 2" title="HBU: which use is worth the most">
          <p>
            Three futures for one building, priced the same way so they can be compared. Office repositioning
            capitalizes stabilized NOI after repositioning capex and leasing costs. Condo conversion values the
            gross sellout against hard, soft, contingency, carry and sales costs. Multifamily rental conversion
            prices the building under 467-m, with unit-level rent (market units at market, affordable units at
            program rent, never a blended dollar per square foot), the tax exemption, and a stabilized cap rate.
          </p>
          <p>
            Each scenario ends in a land residual: the price a developer could pay for the building under that
            use and still earn a target return. The recommendation is the highest residual by default, with
            return on cost and time to stabilization as tie-breakers, and the user can rank by value over cost
            instead. Every assumption is on screen, labeled with its basis, and editable; the whole comparison
            recomputes as you type. The model then writes a four-paragraph rationale from the figures shown and
            says which assumption the answer is most sensitive to.
          </p>
        </Section>

        <Section eyebrow="Tool 3" title="Pro Forma: does it pencil, and when">
          <p>
            The winning scenario becomes a quarterly development cash flow: closing, design and permitting,
            construction with costs spread on an S-curve, then lease-up or sellout, then exit. Equity funds
            first until its share of development cost is in; the construction loan funds the rest, with interest
            capitalized on the drawn balance. Rental and office scenarios repay at exit; condo repays from net
            sales as units close.
          </p>
          <p>
            Out come total cost including interest, equity required and the peak call, unlevered and levered
            IRR, equity multiple, sources and uses, a milestone schedule and a five by five sensitivity grid that
            moves cost against exit value. The Excel export is the same model as formulas, not values: Inputs on
            one sheet, the quarterly cash flow on another with every cell pointing back to Inputs, and IRR
            computed by Excel itself, so the workbook can be audited and extended the way an analyst expects.
          </p>
        </Section>

        <Section eyebrow="Tool 4" title="NYC Wire: what changed this week">
          <p>
            Four topics, each a small set of news-search queries against public feeds: conversions, zoning and
            policy, deals, infrastructure. Headlines are merged and de-duplicated, redirect links are resolved to
            the publisher&apos;s own page, and article images are read from that page where the publisher allows
            it. Every morning a scheduled job reads all four topics and writes a short digest of each with
            numbered links back to the sources, saved as the daily edition so the page opens instantly.
          </p>
          <p>
            The model receives only headlines and sources, never the article text, and it says so. The wire
            does no analysis of its own; it keeps the other three tools honest about the market their
            assumptions describe.
          </p>
        </Section>

        <Section eyebrow="Limits">
          <p>
            First-pass feasibility, not an appraisal, a zoning opinion or investment advice. PLUTO does not know
            about zoning lot mergers, transferred air rights, deed restrictions or pending rezonings. Market
            assumptions are Manhattan starting points that need adjusting for other submarkets.
          </p>
        </Section>

        <p className="about-foot">
          Built by {BRAND.author}, {BRAND.year}. Next.js, Tailwind, Anthropic API, Vercel.{" "}
          <a href={BRAND.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          . Start with <Link href="/zoning">Zoning</Link>.
        </p>
      </div>
    </main>
  );
}
