"use client";

import { useState } from "react";

const EXAMPLES = [
  "305 East 46th Street, Manhattan",
  "675 Third Avenue, Manhattan",
  "25 Water Street, Manhattan",
  "1-1338-1",
];

export default function AddressSearch({ onSearch, busy }) {
  const [q, setQ] = useState(EXAMPLES[0]);
  return (
    <div className="card">
      <p className="eyebrow mb-1">Lot</p>
      <p className="text-[13px] text-[var(--ink-3)]">An NYC street address, or a borough-block-lot like 1-1338-1.</p>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) onSearch(q.trim());
        }}
      >
        <input
          className="field-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="305 East 46th Street, Manhattan"
          aria-label="Address or BBL"
        />
        <button type="submit" className="btn btn-primary" disabled={busy || !q.trim()} style={{ height: 44 }}>
          {busy ? "Looking up" : "Look up"}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="chip chip-outline"
            onClick={() => {
              setQ(ex);
              onSearch(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
