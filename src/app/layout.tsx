import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://photo.ph1l74.com"),
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

// Validate format before injecting into inline scripts — prevents accidental injection
const gaId = /^G-[A-Z0-9]{4,20}$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_ID!
  : null;
const ymId = /^\d{6,12}$/.test(process.env.NEXT_PUBLIC_YM_ID ?? "")
  ? process.env.NEXT_PUBLIC_YM_ID!
  : null;

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

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}</Script>
          </>
        )}

        {ymId && (
          <>
            <Script id="ym-init" strategy="afterInteractive">{`
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,
              k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script",
              "https://mc.yandex.ru/metrika/tag.js","ym");
              ym(${ymId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});
            `}</Script>
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${ymId}`}
                  style={{ position: "absolute", left: "-9999px" }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
