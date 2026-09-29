import ModuleBar from "@/components/shell/ModuleBar";

export const metadata = {
  title: "Zoning",
  description: "Buildable envelope, unused development rights and program eligibility for any NYC lot, from PLUTO.",
};

export default function ModuleLayout({ children }) {
  return (
    <div className="app-zoning">
      <ModuleBar moduleKey="zoning" />
      {children}
    </div>
  );
}
