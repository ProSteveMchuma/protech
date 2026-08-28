import type { Metadata } from "next";
import { SerialProStudio } from "@/components/proprint/SerialProStudio";

export const metadata: Metadata = { title: "SerialPro — PDF numbering and cut-and-stack", description: "Add sequential numbers to receipts, tickets and NCR artwork, then create step-and-repeat or cut-and-stack production PDFs locally in your browser." };
export default function SerialProPage(){ return <SerialProStudio/>; }
