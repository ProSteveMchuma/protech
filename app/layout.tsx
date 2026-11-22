import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/store/AppChrome";
import { Analytics } from "@vercel/analytics/next";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ContactClickTracker } from "@/components/ContactClickTracker";
import { groupImage } from "@/lib/printshop/images";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessJsonLd, SITE_URL, websiteJsonLd } from "@/lib/seo";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const shopDescription = "Order business cards, flyers, banners, branded apparel and packaging online. Printed in Nairobi, paid by M-Pesa, delivered across Kenya or collected at Karen.";

const homeTitle = "ProPrint — Online Printing in Nairobi, Kenya";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: homeTitle, template: "%s | ProPrint" },
  description: shopDescription,
  applicationName: "ProPrint",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    title: homeTitle,
    description: shopDescription,
    siteName: "ProPrint",
    images: [{ url: groupImage["business-cards"], alt: "Printed business cards from ProPrint" }],
  },
  twitter: { card: "summary_large_image", title: homeTitle, description: shopDescription, images: [groupImage["business-cards"]] },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-KE" className={`${sans.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-neutral-950 antialiased">
        <JsonLd data={[localBusinessJsonLd, websiteJsonLd]} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgress />
        <AppChrome>
          <main id="main-content">{children}</main>
        </AppChrome>
        <Analytics />
        <ContactClickTracker />
      </body>
    </html>
  );
}
