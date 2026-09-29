import ModuleBar from "@/components/shell/ModuleBar";
import "./wire.css";

export const metadata = {
  title: "NYC Wire",
  description:
    "New York development news grouped by topic: conversions, zoning and policy, deals, infrastructure.",
};

export default function ModuleLayout({ children }) {
  return (
    <div className="app-wire">
      <ModuleBar moduleKey="wire" />
      {children}
    </div>
  );
}
