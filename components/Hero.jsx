"use client";

import Link from "next/link";

// TBD.NYC landing hero: a full-bleed drafting grid with a soft glow, the
// headline block on the left, the mark on the right, and a floating preview
// of a real result beneath. Sized to fill the space between header and
// footer so the cover does not scroll past the footer on a normal screen.

const PREVIEW = {
  title: "305 East 46 Street, Manhattan",
  meta: "BBL 1-1339-5, C1-9, 153,689 SF, built 1928, 467-m eligible",
  cols: [
    { label: "Office repositioning", residual: "$2.2M", psf: "$14/SF", noi: "NOI $2.4M at 7.5%" },
    { label: "Condo conversion", residual: "$63.6M", psf: "$414/SF", noi: "Sellout $227.8M, 126 units", winner: true },
    { label: "Rental conversion, 467-m", residual: "$25.3M", psf: "$165/SF", noi: "NOI $5.7M at 5.0%" },
  ],
};

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-wash" aria-hidden="true" />

      <div className="hero-wrap">
        <div className="hero-top">
          <div className="hero-copy">
            <div className="hero-now">
              <span>Live</span>
              <span>NYC Open Data, MapPLUTO 26v2</span>
            </div>
            <h1 className="hero-title">
              TBD.NYC
              <span className="hero-expansion">(To Be Developed).</span>
            </h1>
            <p className="hero-sub">NYC repositioning feasibility suite</p>
            <p className="hero-lede">
              Pull any New York City lot from public records, test what it can become, and underwrite the
              winning scenario. Zoning envelope, highest and best use, and development pro forma in one path,
              with a daily wire on conversions, zoning, and deals.
            </p>
            <div className="hero-actions">
              <Link href="/zoning" className="btn btn-primary" style={{ height: 44, padding: "0 20px" }}>
                Look up a lot
              </Link>
              <Link href="/about" className="btn btn-ghost" style={{ height: 44, padding: "0 20px" }}>
                How it works
              </Link>
            </div>
          </div>

          <img
            src="/tbd-mark.svg"
            alt="Statue of Liberty examining the skyline through a magnifying glass"
            className="hero-mark"
            fetchPriority="high"
          />
        </div>

        {/* A real result, as a preview card */}
        <Link href="/hbu" className="hero-preview" aria-label="Open HBU with the sample building">
          <div className="hero-preview-bar">
            <span className="hero-preview-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="hero-preview-title">HBU: {PREVIEW.title}</span>
            <span className="hero-preview-meta">{PREVIEW.meta}</span>
          </div>
          <div className="hero-preview-body">
            {PREVIEW.cols.map((c) => (
              <div key={c.label} className={`hero-preview-col${c.winner ? " is-winner" : ""}`}>
                <div className="hero-preview-label">
                  {c.label}
                  {c.winner && <span className="chip chip-ink">Recommended</span>}
                </div>
                <div className="hero-preview-value">
                  {c.residual} <small>{c.psf}</small>
                </div>
                <div className="hero-preview-note">Land residual. {c.noi}</div>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
