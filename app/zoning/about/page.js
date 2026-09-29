export const metadata = { title: "About Zoning" };

export default function AboutZoning() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-10 pb-8">
      <div className="card" style={{ maxWidth: 800, padding: "32px 36px" }}>
        <p className="eyebrow mb-2">About</p>
        <h1 className="text-[26px] leading-tight text-[var(--ink)]">
          What the lot can hold, read straight from the city&apos;s own records
        </h1>
        <p className="mt-3 text-[14px] text-[var(--ink-2)]">
          Zoning is the first stop in the suite. Before anyone models a use, it answers the
          question every New York deal starts with: how much floor area is allowed here, how
          much is already built, and which programs would change the answer.
        </p>

        <section className="mt-8">
          <p className="eyebrow mb-2">Data</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            Lot records come live from MapPLUTO on NYC Open Data, the Department of City
            Planning&apos;s tax-lot dataset: lot area, zoning districts, overlays, special
            districts, maximum floor area ratios by use, building class, year built, number of
            floors and total built floor area. Addresses are resolved to a borough-block-lot
            through the city&apos;s GeoSearch service.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Method</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            Buildable floor area is lot area times the maximum FAR for each use. Unused
            development rights are buildable minus built. Program eligibility is a set of
            published rules (district, year built, building class, floor area) applied as
            written; each flag shows the rule it came from so a reviewer can disagree with the
            rule rather than the tool.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Limitations</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            PLUTO is a first-pass source. It does not know about zoning lot mergers, transferred
            air rights, deed restrictions, landmark status in every case, or pending rezonings,
            and its FAR fields do not capture bonuses that depend on a specific program. Treat
            the envelope as the starting point for a zoning analysis, not the conclusion.
          </p>
        </section>
      </div>
    </main>
  );
}
