import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { business } from "@/lib/config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const siteUrl = "https://luxehealthmassage.netlify.app";
const description =
  "Luxe Health Massage — Koh Samui's premier medical & wellness massage studio in Bang Por. Lymphatic drainage, sports recovery, cellulite therapy, traditional Thai, aromatherapy & more. In-spa or in-home. Book via WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Luxe Health Massage · Koh Samui Medical & Wellness Spa",
    template: "%s · Luxe Health Massage",
  },
  description,
  keywords: [
    "Koh Samui massage",
    "lymphatic drainage Koh Samui",
    "sports massage Samui",
    "Bang Por massage",
    "Mae Nam spa",
    "in-home massage Koh Samui",
    "cellulite massage",
    "wellness spa Koh Samui",
  ],
  openGraph: {
    title: "Luxe Health Massage · Koh Samui Medical & Wellness Spa",
    description,
    url: siteUrl,
    siteName: business.name,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxe Health Massage — Koh Samui",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxe Health Massage · Koh Samui",
    description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#8b2530",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-cream text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
