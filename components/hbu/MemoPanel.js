"use client";

import { useState } from "react";

// Renders light markdown from the memo: paragraphs and **bold**.
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

export default function MemoPanel({ payload, disabled }) {
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function write() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/hbu/memo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setMemo(data.memo);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const paras = memo.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Rationale</p>
          <p className="text-[13px] text-[var(--ink-3)]">
            Written by the model from the numbers on this page. It explains the ranking; it does not change it.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={write} disabled={busy || disabled}>
          {busy ? "Writing" : memo ? "Rewrite" : "Write rationale"}
        </button>
      </div>
      {error && <p className="mt-3 text-[13px] text-[var(--tier-3)]">{error}</p>}
      {memo && (
        <div className="memo-body mt-4">
          {paras.map((p, i) => (
            <p key={i}>{renderInline(p)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
