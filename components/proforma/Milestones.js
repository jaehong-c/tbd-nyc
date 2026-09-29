export default function Milestones({ model }) {
  return (
    <div className="card">
      <p className="eyebrow mb-2">Milestones</p>
      {model.milestones.map((m) => (
        <div key={m.label} className="milestone">
          <span className="q">Q{m.q}</span>
          <span>
            <span className="text-[var(--ink)]">{m.label}</span>
            <small>{m.note}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
