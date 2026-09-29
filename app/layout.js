import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppHeader from "@/components/shell/AppHeader";
import AppFooter from "@/components/shell/AppFooter";
import ScrollToTop from "@/components/shell/ScrollToTop";
import { BRAND } from "@/lib/brand";
import "./globals.css";
import "./tbd.css";

// Three faces: Newsreader for display and the hero, Plex Sans for UI,
// Plex Mono for figures. tbd.css maps them onto the shell's font tokens.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
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
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable} ${plexSans.className}`}
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
