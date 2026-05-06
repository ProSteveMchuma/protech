import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proremotetasks.co.ke"),
  title: {
    default: "Pro Remote Tasks — Vetted Kenyan virtual assistants & digital experts",
    template: "%s | Pro Remote Tasks",
  },
  description:
    "World-class talent. Kenyan rates. Zero hassle. Pro Remote Tasks connects you with managed virtual assistants, social media managers, and content writers — onboarded in 24 hours.",
  keywords: [
    "virtual assistant Kenya",
    "social media management Nairobi",
    "SEO content writing Kenya",
    "remote talent Kenya",
    "Kenyan VA",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    title: "Pro Remote Tasks — Vetted Kenyan talent on demand",
    description:
      "World-class talent. Kenyan rates. Zero hassle. Onboard a vetted VA, social media manager, or content writer in 24 hours.",
    siteName: "Pro Remote Tasks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Remote Tasks",
    description: "Vetted Kenyan talent. Onboarded in 24 hours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <ScrollProgress />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
