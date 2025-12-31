import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pro Innovation & Technologies | Web Design, Branding & Tenders Kenya",
  description: "Leading tech agency in Machakos & Nairobi. Services: Web & Graphic Design, AI Automation, Professional Tender Writing, and Premium Branding/Printing.",
  keywords: ["Web Design Kenya", "Tender Writing Services Nairobi", "Branding Machakos", "AI Automation Kenya", "Printing Services Kenya", "ProTech"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://proinnovation.tech",
    siteName: "Pro Innovation & Technologies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

