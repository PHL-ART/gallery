import type { Metadata } from "next";
import { Barlow_Condensed, Figtree, Azeret_Mono } from "next/font/google";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ph1l74 — Filat Astakhov",
  description: "Street and documentary photography by Filat Astakhov",
  openGraph: {
    title: "ph1l74 — Filat Astakhov",
    description: "Street and documentary photography by Filat Astakhov",
    type: "website",
  },
};

// Runs synchronously before hydration to prevent theme flash
const themeScript = `
  try {
    var t = localStorage.getItem('ph1l74-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${barlowCondensed.variable} ${figtree.variable} ${azeretMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
