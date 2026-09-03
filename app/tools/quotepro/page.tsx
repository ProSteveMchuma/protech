import type { Metadata } from "next";
import { QuoteProStudio } from "@/components/proprint/QuoteProStudio";

export const metadata: Metadata = {
    title: "QuotePro — Print quotation calculator",
    description: "Calculate print job costs, markup, tax and selling price in seconds with a local browser-based quotation workspace.",
};

export default function QuoteProPage() {
    return <QuoteProStudio />;
}
