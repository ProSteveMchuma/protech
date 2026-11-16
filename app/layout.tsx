import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/store/AppChrome";
import { ScrollProgress } from "@/components/ScrollProgress";
import { groupImage } from "@/lib/printshop/images";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const shopDescription = "Order business cards, flyers, banners, branded apparel and packaging online. Printed in Nairobi, paid by M-Pesa, delivered across Kenya or collected at Karen.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.proinnovationtech.co.ke"),
  title: { default: "ProPrint — Online printing in Kenya", template: "%s | ProPrint" },
  description: shopDescription,
  keywords: ["printing services Kenya", "print on demand Kenya", "business cards Nairobi", "banner printing Kenya", "t-shirt printing Nairobi"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    title: "ProPrint — Online printing in Kenya",
    description: shopDescription,
    siteName: "ProPrint",
    images: [{ url: groupImage["business-cards"], alt: "Printed business cards from ProPrint" }],
  },
  twitter: { card: "summary_large_image", title: "ProPrint — Online printing in Kenya", description: shopDescription, images: [groupImage["business-cards"]] },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ProPrint",
  url: "https://www.proinnovationtech.co.ke",
  email: "proinnovationtech@gmail.com",
  telephone: "+254719584549",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karen Green, Langata Road",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-neutral-950 antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgress />
        <AppChrome>
          <main id="main-content">{children}</main>
        </AppChrome>
      </body>
    </html>
  );
}
