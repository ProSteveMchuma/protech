import type { Metadata } from "next";
import { business } from "@/lib/config";

export const metadata: Metadata = {
  title: "Print terms",
  description: "How ProPrint orders, payments, artwork and delivery work.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Print terms</h1>
      <div className="mt-8 grid gap-6 text-sm leading-6 text-neutral-700">
        <p>ProPrint is the print desk of {business.name}. Prices on the product page are the production prices for the options shown. Delivery is added at checkout and is free from KES 10,000.</p>
        <p>Pay the order total to Paybill {business.paybill}, using the name on the order as the account. We start production after that M-Pesa code matches. A code that does not match is not a paid order.</p>
        <p>You are responsible for the spelling, images and rights in the artwork. Send a PDF or PNG. We check that the file can print, and we will pause the job if it will not. Colour on screen and colour on paper can differ.</p>
        <p>Standard jobs take about 3 business days in production. Express and rush are faster when the file is approved in time. Same-day Nairobi printing applies only to selected digital jobs approved before 10:00. Delivery times after dispatch are estimates.</p>
        <p>If we cannot print the job, we say so and agree the next step with you, including a refund of a payment we have confirmed. Questions go to {business.supportEmail}.</p>
      </div>
    </div>
  );
}
