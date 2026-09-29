"use client";

import Link from "next/link";

// TBD.NYC landing hero.
// Rebuilt from the 21st.dev "vercel-hero" for this stack: JavaScript, Tailwind v4,
// no shadcn, no @aliimam packages. Only dependency is next/link.
// All colors and fonts are CSS variables on the <section>, so the look is tuned here.

const TOOLS = [
  { label: "Zoning", href: "/zoning" },
  { label: "HBU", href: "/hbu" },
  { label: "Pro Forma", href: "/proforma" },
  { label: "NYC Wire", href: "/wire" },
];

const TOKENS = {
  "--tbd-paper": "#FFFFFF",
  "--tbd-ink": "#000000",
  "--tbd-muted": "#5C5C57",
  "--tbd-rule": "#E3E3DE",
  // NYC zoning map convention: residence yellow, commercial red, manufacturing purple
  "--tbd-zone-r": "#F2DE5A",
  "--tbd-zone-c": "#D9413A",
  "--tbd-zone-m": "#7E5BB3",
  // Set --font-display / --font-sans in app/layout.js via next/font; fallbacks apply until then
  "--tbd-font-display": "var(--font-display, 'Newsreader', Georgia, serif)",
  "--tbd-font-sans": "var(--font-sans, 'IBM Plex Sans', system-ui, sans-serif)",
};

export default function Hero() {
  return (
    <section
      style={TOKENS}
      className="bg-[var(--tbd-paper)] text-[var(--tbd-ink)] [font-family:var(--tbd-font-sans)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 pt-10 text-center lg:px-0">
        <div className="relative grid w-full grid-cols-10 border-0 border-b border-[var(--tbd-rule)] md:border">
          {/* Zoning-map wash, masked so it only rises from the bottom of the sheet */}
          <div
            className="absolute inset-0 -z-20"
            style={{
              background:
                "linear-gradient(90deg, var(--tbd-zone-r) 0%, var(--tbd-zone-c) 50%, var(--tbd-zone-m) 100%)",
              opacity: 0.8,
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 55%)",
              maskImage: "linear-gradient(to top, black 0%, transparent 55%)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          />

          <Crosshair className="absolute -top-4 -left-4" />
          <Crosshair className="absolute -bottom-4 -right-4" />

          {/* Left margin column */}
          <div className="col-span-1 hidden w-full md:grid">
            <Cells className="aspect-square flex-1 border-b border-[var(--tbd-rule)] last:border-0" />
          </div>

          <div className="col-span-10 md:col-span-8">
            {/* Top row of cells */}
            <div className="hidden md:flex">
              <Cells className="aspect-square flex-1 border-l border-[var(--tbd-rule)] last:border-r" />
            </div>

            {/* Title block */}
            <div className="relative -mt-0.5 flex w-full flex-col items-center justify-center border border-[var(--tbd-rule)] p-6 md:h-89 md:p-16 lg:h-116">
              <h1
                className="text-4xl font-semibold leading-none tracking-tight lg:text-6xl"
                style={{ fontFamily: "var(--tbd-font-display)" }}
              >
                TBD.NYC (To Be Developed):
              </h1>
              <p
                className="mt-3 text-xl italic leading-tight lg:text-2xl"
                style={{ fontFamily: "var(--tbd-font-display)" }}
              >
                NYC repositioning feasibility suite
              </p>
              <p className="max-w-xl py-6 text-base leading-relaxed text-[var(--tbd-muted)] lg:text-lg">
                Pull any New York City lot from public records, test what it can become,
                and underwrite the winning scenario. Zoning envelope, highest and best use,
                and development pro forma in one path, with a daily wire on conversions,
                zoning, and deals.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="inline-flex h-11 items-center justify-center rounded-[4px] border border-[var(--tbd-ink)] px-5 text-sm font-medium transition-colors hover:bg-[var(--tbd-ink)] hover:text-[var(--tbd-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbd-ink)] focus-visible:ring-offset-2"
                  >
                    {tool.label}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center justify-center rounded-[4px] border border-transparent px-5 text-sm font-medium text-[var(--tbd-muted)] underline-offset-4 transition-colors hover:text-[var(--tbd-ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbd-ink)] focus-visible:ring-offset-2"
                >
                  About
                </Link>
              </div>
            </div>

            {/* Lower cells with the envelope mark sitting on the sheet */}
            <div className="relative h-full w-full">
              <div className="absolute top-15 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:top-22 lg:top-29">
                {/* Mark lives at /public/tbd-mark.svg; grays are set inside that file */}
                <img
                  src="/tbd-mark.svg"
                  alt="Statue of Liberty examining the skyline through a magnifying glass"
                  className="size-40 md:size-56 lg:size-72"
                  fetchPriority="high"
                />
              </div>

              <div className="flex">
                <Cells className="aspect-square flex-1 border-b border-l border-[var(--tbd-rule)] last:border-r" />
              </div>
              <div className="flex">
                <Cells className="aspect-square flex-1 border-b border-l border-[var(--tbd-rule)] last:border-r" />
              </div>
              <div className="flex">
                <Cells className="aspect-square flex-1 border-l border-[var(--tbd-rule)] last:border-r" />
              </div>
            </div>
          </div>

          {/* Right margin column */}
          <div className="col-span-1 hidden md:grid">
            <Cells className="aspect-square flex-1 border-b border-[var(--tbd-rule)] last:border-b-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cells({ count = 8, className }) {
  return Array.from({ length: count }).map((_, i) => <div key={i} className={className} />);
}

function Crosshair({ className }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
    >
      <path d="M15 0v30M0 15h30" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
