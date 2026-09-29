import ModuleStub from "@/components/shell/ModuleStub";
import { moduleByKey } from "@/lib/brand";

export default function ZoningPage() {
  return (
    <ModuleStub
      moduleKey="zoning"
      phase="3"
      inputs={[
        "A street address or borough-block-lot (BBL)",
        "Optional: intended use, if you already know the direction",
      ]}
      outputs={[
        "Lot area, zoning district, overlays and special districts from MapPLUTO",
        "Maximum floor area ratio by use: residential, commercial, community facility",
        "Built floor area today versus buildable, and the unused development rights",
        "Program flags: 467-m, 485-x, City of Yes conversion eligibility, by rule",
        "A lot card that carries straight into HBU",
      ]}
      next={moduleByKey("hbu")}
    />
  );
}
