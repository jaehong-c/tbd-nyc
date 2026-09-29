import ModuleStub from "@/components/shell/ModuleStub";
import { moduleByKey } from "@/lib/brand";

export default function HbuPage() {
  return (
    <ModuleStub
      moduleKey="hbu"
      phase="2"
      inputs={[
        "The lot card from Zoning, or gross SF, floors, typical floor and zoning entered by hand",
        "Current use, occupancy and acquisition basis",
        "Market assumptions, pre-filled from a maintained NYC default set and editable",
      ]}
      outputs={[
        "Office repositioning: rent, occupancy, NOI, cap rate, stabilized value, capex",
        "Condo conversion: sellout, cost, profit margin, land residual",
        "Multifamily rental conversion with 467-m: units, NOI, value, yield on cost",
        "A side-by-side comparison and a recommended use with the reasoning",
        "A written rationale from the model, using only the numbers on screen",
      ]}
      next={moduleByKey("proforma")}
    />
  );
}
