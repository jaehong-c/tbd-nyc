import { int } from "@/lib/hbu/format";

function Fact({ label, value, unit }) {
  return (
    <div>
      <div className="fact-label">{label}</div>
      <div className="fact-value">
        {value}
        {unit ? <small>{unit}</small> : null}
      </div>
    </div>
  );
}

export default function LotFacts({ a }) {
  const { lot, building, id } = a;
  const yr = building.yearBuilt ? `${building.yearBuilt}${building.yearAltered ? ` (alt. ${building.yearAltered})` : ""}` : "n/a";
  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">{id.borough}, block {id.block}, lot {id.lot}</p>
          <h2 className="text-[22px] leading-tight text-[var(--ink)]">{a.address || a.lotCard.address}</h2>
          <p className="mt-1 text-[13px] text-[var(--ink-3)]">
            {building.use}
            {building.bldgClass ? ` (class ${building.bldgClass})` : ""}
            {lot.owner ? `, owner of record ${lot.owner}` : ""}
          </p>
        </div>
        <span className="chip chip-outline">BBL {a.bbl}</span>
      </div>

      <div className="fact-grid mt-5">
        <Fact label="Lot area" value={int(lot.lotArea)} unit="SF" />
        <Fact label="Built floor area" value={int(building.bldgArea)} unit="SF" />
        <Fact label="Floors" value={building.numFloors ?? "n/a"} />
        <Fact label="Year built" value={yr} />
        <Fact label="Zoning district" value={lot.districts.join(" / ") || "n/a"} />
        <Fact label="Overlay" value={lot.overlays.join(" / ") || "none"} />
        <Fact label="Special district" value={lot.specials.join(" / ") || "none"} />
        <Fact label="Lot front x depth" value={lot.lotFront && lot.lotDepth ? `${lot.lotFront} x ${lot.lotDepth}` : "n/a"} unit="ft" />
        <Fact label="Residential units" value={building.unitsRes ?? 0} />
        <Fact label="Office area" value={int(building.officeArea)} unit="SF" />
        <Fact label="Retail area" value={int(building.retailArea)} unit="SF" />
        <Fact label="Assessed total" value={building.assessTotal ? `$${int(building.assessTotal)}` : "n/a"} />
      </div>
    </div>
  );
}
