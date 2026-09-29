export const metadata = { title: "About Pro Forma" };

export default function AboutProforma() {
  return (
    <main className="mx-auto max-w-7xl px-6 pt-10 pb-8">
      <div className="card" style={{ maxWidth: 800, padding: "32px 36px" }}>
        <p className="eyebrow mb-2">About</p>
        <h1 className="text-[26px] leading-tight text-[var(--ink)]">
          From a recommended use to a quarter-by-quarter plan for paying for it
        </h1>
        <p className="mt-3 text-[14px] text-[var(--ink-2)]">
          Pro Forma is where the suite stops asking what a building could be and starts asking
          whether the plan pencils and when the money is needed. It takes the winning scenario
          from HBU and lays it out over time.
        </p>

        <section className="mt-8">
          <p className="eyebrow mb-2">Method</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            Costs are spread over the construction period on an S-curve, revenue follows the
            lease-up or sellout assumption, and financing is a simple construction loan drawn
            against a loan-to-cost limit with equity first. Returns are computed on the
            resulting quarterly cash flows. The sensitivity grid reruns the same model across
            a range of cost, cap rate and rent inputs so the fragile assumptions show themselves.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Excel export</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            The workbook is not a paste of the screen. Inputs sit on one sheet, the cash flow
            on another, and every figure on the cash flow is a formula that points back to the
            inputs, so the model can be audited and extended in Excel the way an analyst would
            expect.
          </p>
        </section>

        <section className="mt-8">
          <p className="eyebrow mb-2">Limitations</p>
          <p className="mb-3 text-[14px] leading-relaxed text-[var(--ink-2)]">
            One loan, one equity tranche, no waterfall, no tax. It is the model you build on
            day one to see whether a deal deserves a real one. Nothing here is investment
            advice.
          </p>
        </section>
      </div>
    </main>
  );
}
