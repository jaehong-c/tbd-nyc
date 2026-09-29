import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppHeader from "@/components/shell/AppHeader";
import AppFooter from "@/components/shell/AppFooter";
import ScrollToTop from "@/components/shell/ScrollToTop";
import { BRAND } from "@/lib/brand";
import "./globals.css";
import "./tbd.css";

// Two faces: Manrope for everything readable, Plex Mono for figures.
// tbd.css maps them onto the shell's font tokens.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${BRAND.name} (${BRAND.expansion})`,
    template: `%s · ${BRAND.name}`,
  },
  description: `${BRAND.tagline}: zoning envelope, highest and best use, development pro forma and New York development news for any NYC lot.`,
  icons: { icon: "/tbd-mark.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} ${manrope.className}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ScrollToTop />
        <AppHeader />
        <div className="shell-main">{children}</div>
        <AppFooter />
        <Analytics />
      </body>
    </html>
  );
}
