import ModuleStub from "@/components/shell/ModuleStub";

export default function ProformaPage() {
  return (
    <ModuleStub
      moduleKey="proforma"
      phase="4"
      inputs={[
        "The recommended scenario from HBU, or any scenario picked by hand",
        "Program length, phasing, construction draw shape and financing terms",
        "Exit or stabilization assumptions",
      ]}
      outputs={[
        "Sources and uses, and a quarterly cash flow from closing to stabilization",
        "Construction draw on an S-curve and the capital call schedule it implies",
        "Unlevered and levered IRR, equity multiple and peak equity",
        "A three-way sensitivity grid: cost overrun, exit cap rate, rent or price",
        "A milestone schedule and an Excel workbook with live formulas",
      ]}
    />
  );
}
