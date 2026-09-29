export const metadata = { title: "About HBU" };

export default function AboutHbu() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-10 pb-8">
      <div className="card" style={{ maxWidth: 800, padding: "32px 36px" }}>
        <p className="eyebrow mb-2">About</p>
        <h1 className="text-[26px] leading-tight text-[var(--ink)]">
          Three futures for one building, priced the same way so they can be compared
        </h1>
        <p className="mt-3 text-[14px] text-[var(--ink-2)]">
          HBU takes a lot from Zoning and asks what it is worth as an office, as condos and as
          rental apartments. The three scenarios share one set of inputs and one set of market
          assumptions, so the comparison is about the building, not about who filled in the
          form.
        </p>

        <section className="mt-8">
          <p className="eyebrow mb-2">Origin</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            The engine began as a written analysis procedure with a separate table of NYC
            default assumptions, built for a broker opinion of value on a Midtown East office
            building. Here the procedure is code and the assumption table is a data file, so
            cap rates, construction costs and program terms can be updated without touching
            the logic.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Method</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            Each scenario is a direct capitalization or sellout model with explicit
            conversion cost, loss factor, absorption and program terms. Unit counts for the
            residential scenarios come from usable floor area and a unit mix, not a blended
            price per square foot, which is the step most likely to overstate value. The
            recommendation is rule-based: highest value net of cost, with yield on cost and
            time to stabilization as tie-breakers. The model writes the rationale afterwards
            and is not allowed to change a number.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Limitations</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            This is a first-pass valuation, not an appraisal. Comparable sales, actual leases,
            floor plates that resist conversion and financing terms all move the answer, and
            none of them are in the tool unless you enter them. Nothing here is investment
            advice.
          </p>
        </section>
      </div>
    </main>
  );
}
