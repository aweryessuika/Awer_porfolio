import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://awer-porfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pranjay Rathore — AI Filmmaker & Creative Developer",
  description:
    "Pranjay Rathore directs generative video and builds the web it lives on. AI campaigns, kinetic reel edits and creative code.",
  openGraph: {
    title: "Pranjay Rathore — AI Filmmaker & Creative Developer",
    description: "AI directing, generative video and creative code.",
    url: SITE_URL,
    siteName: "Pranjay Rathore",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Pranjay Rathore, backlit by a blue anamorphic flare" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranjay Rathore — AI Filmmaker & Creative Developer",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to work
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
