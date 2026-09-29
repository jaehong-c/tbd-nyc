// Number formatting shared by the HBU screens. Money in short form for the
// cards ($105.8M), full form in tooltips, tabular for tables.

export function money(n, { short = true } = {}) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "n/a";
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);
  if (short) {
    if (v >= 1e9) return `${sign}$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `${sign}$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${sign}$${Math.round(v / 1e3)}K`;
    return `${sign}$${Math.round(v)}`;
  }
  return `${sign}$${Math.round(v).toLocaleString("en-US")}`;
}

export function psf(n, digits = 0) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "n/a";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}/SF`;
}

export function pct(n, digits = 1) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "n/a";
  return `${(n * 100).toFixed(digits)}%`;
}

export function int(n) {
  if (n === null || n === undefined || !Number.isFinite(n)) return "n/a";
  return Math.round(n).toLocaleString("en-US");
}

export function monthsLabel(m) {
  if (!m) return "n/a";
  return m >= 12 ? `${(m / 12).toFixed(m % 12 ? 1 : 0)} yrs` : `${m} mo`;
}
