import Link from "next/link";
import { moduleByKey } from "@/lib/brand";

// Placeholder body for a module whose engine is still being built. Shows the
// module's question, what it will take in and what it will return, so the
// suite reads as a whole while the phases land one by one.
export default function ModuleStub({ moduleKey, phase, inputs, outputs, next }) {
  const m = moduleByKey(moduleKey);
  return (
    <main className="mx-auto max-w-7xl px-6 pt-10 pb-8">
      <div className="card" style={{ maxWidth: 800, padding: "32px 36px" }}>
        <p className="eyebrow mb-2">Phase {phase}, in development</p>
        <h1 className="text-[26px] leading-tight text-[var(--ink)]">{m.question}</h1>
        <p className="mt-3 text-[14px] text-[var(--ink-2)]">{m.blurb}</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section>
            <p className="eyebrow mb-2">Takes</p>
            <ul className="space-y-1.5 text-[14px] text-[var(--ink-2)]">
              {inputs.map((s) => (
                <li key={s} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[var(--ink)]" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow mb-2">Returns</p>
            <ul className="space-y-1.5 text-[14px] text-[var(--ink-2)]">
              {outputs.map((s) => (
                <li key={s} className="flex gap-2">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[var(--ink)]" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {next && (
          <p className="mt-8 text-[13px] text-[var(--ink-3)]">
            The result feeds{" "}
            <Link href={next.href} className="underline underline-offset-4 text-[var(--ink)]">
              {next.name}
            </Link>{" "}
            as its starting input.
          </p>
        )}
      </div>
    </main>
  );
}
