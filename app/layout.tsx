import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/seo/structured-data";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Pro Innovation & Technologies | Web Design, Branding & Tenders Kenya",
  description: "Leading tech agency in Machakos & Nairobi. Services: Web & Graphic Design, AI Automation, Professional Tender Writing, and Premium Branding/Printing.",
  keywords: ["Web Design Kenya", "Tender Writing Services Nairobi", "Branding Machakos", "AI Automation Kenya", "Printing Services Kenya", "ProTech"],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://proinnovation.tech",
    siteName: "Pro Innovation & Technologies",
    images: [{
      url: '/og-image.jpg', // Ensure this lands in public folder eventually
      width: 1200,
      height: 630,
      alt: 'Pro Innovation & Technologies Kenya',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro Innovation | Best Web Design & Tender Services Kenya',
    description: 'We help Kenyan businesses win more tenders and get more customers online. Expert Web Design, Branding, and AI Automation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }} className="light">
      <body className={inter.className}>
        <Navbar />
        <StructuredData />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

