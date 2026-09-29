import ModuleBar from "@/components/shell/ModuleBar";

export const metadata = {
  title: "Pro Forma",
  description: "Phased development cash flow, capital calls, returns and sensitivity for the chosen scenario, exportable to Excel.",
};

export default function ModuleLayout({ children }) {
  return (
    <div className="app-proforma">
      <ModuleBar moduleKey="proforma" />
      {children}
    </div>
  );
}
