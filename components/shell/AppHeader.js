"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, MODULES } from "@/lib/brand";

// Text links with air between them, one accent underline on the active
// page, and a single call to action on the right.
export default function AppHeader() {
  const path = usePathname();
  const links = [
    { href: "/", label: "Home", active: path === "/" },
    { href: "/about", label: "About", active: path === "/about" },
    ...MODULES.map((m) => ({
      href: m.href,
      label: m.name,
      active: path === m.href || path.startsWith(m.href + "/"),
    })),
  ];

  return (
    <header className="shell-header">
      <div className="shell-wrap shell-header-row">
        <Link href="/" className="shell-brand" aria-label={`${BRAND.name} home`}>
          <img src="/tbd-mark.svg" alt="" className="shell-brand-img" aria-hidden="true" />
          <span className="shell-brand-name">
            {BRAND.short}.<small>NYC</small>
          </span>
        </Link>

        <nav className="shell-nav" aria-label="Suite" style={{ display: "flex", alignItems: "center" }}>
          <div className="shell-nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`shell-nav-link${l.active ? " is-active" : ""}`}
                aria-current={l.active ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/zoning" className="shell-nav-cta">
            Look up a lot
          </Link>
        </nav>
      </div>
    </header>
  );
}
