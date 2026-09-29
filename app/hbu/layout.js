import ModuleBar from "@/components/shell/ModuleBar";
import "./hbu.css";

export const metadata = {
  title: "HBU",
  description: "Highest and best use across office repositioning, condo conversion and multifamily rental conversion.",
};

export default function ModuleLayout({ children }) {
  return (
    <div className="app-hbu">
      <ModuleBar moduleKey="hbu" />
      {children}
    </div>
  );
}
