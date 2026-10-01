import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/store/AppChrome";
import { ScrollProgress } from "@/components/ScrollProgress";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.proinnovationtech.co.ke"),
  title: { default: "ProPrint — Online printing in Kenya", template: "%s | ProPrint" },
  description: "Order business cards, banners, flyers, t-shirts, mugs and stickers online. Same-day printing in Nairobi and delivery across all 47 counties.",
  keywords: ["printing services Kenya", "print on demand Kenya", "business cards Nairobi", "banner printing Kenya", "t-shirt printing Nairobi", "same day printing Nairobi"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    title: "ProPrint — Online printing in Kenya",
    description: "Made-to-order printing for businesses and events, delivered across Kenya.",
    siteName: "ProPrint",
  },
  twitter: { card: "summary_large_image", title: "ProPrint — Online printing in Kenya", description: "Same-day Nairobi printing and nationwide delivery." },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${fraunces.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-neutral-950 antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ScrollProgress />
        <AppChrome>
          <main id="main-content">{children}</main>
        </AppChrome>
      </body>
    </html>
  );
}
