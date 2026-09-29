// One line icon per module: 16px grid, 1.6px rounded strokes, currentColor
// so it inverts on the active state.
//   zoning   : a lot with a smaller footprint inside it, the envelope
//   hbu      : three bars of different heights, the scenarios compared
//   proforma : a ledger, rows of figures
//   wire     : broadcast waves, the wire
const PATHS = {
  zoning: (
    <>
      <path d="M2.25 2.25h11.5v11.5H2.25z" />
      <path d="M5.5 5.5h5v5h-5z" strokeDasharray="1.6 1.6" />
    </>
  ),
  hbu: (
    <>
      <path d="M3 13.5V9.5" />
      <path d="M8 13.5V4" />
      <path d="M13 13.5V7" />
      <path d="M1.75 13.5h12.5" />
    </>
  ),
  proforma: (
    <>
      <path d="M2.25 2.25h11.5v11.5H2.25z" />
      <path d="M2.25 6h11.5M2.25 9.75h11.5" />
      <path d="M6 6v7.75" />
    </>
  ),
  wire: (
    <>
      <circle cx="8" cy="10.25" r="1.4" fill="currentColor" stroke="none" />
      <path d="M8 11.5v3" />
      <path d="M4.85 7.1a4.45 4.45 0 0 1 6.3 0" />
      <path d="M2.25 4.5a8.15 8.15 0 0 1 11.5 0" />
    </>
  ),
};

export default function ModuleIcon({ moduleKey, size = 15, style, className }) {
  const body = PATHS[moduleKey];
  if (!body) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, ...style }}
    >
      {body}
    </svg>
  );
}
