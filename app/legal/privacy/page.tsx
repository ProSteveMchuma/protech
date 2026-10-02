import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How ProPrint uses the details and artwork you send with a print order.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Privacy</h1>
      <div className="mt-8 grid gap-6 text-sm leading-6 text-neutral-700">
        <p>
          ProPrint is the print desk of Pro Innovation & Technologies. This page covers the information we receive when you use the shop at proinnovationtech.co.ke.
        </p>
        <p>
          When you place an order or request a quote, we keep the contact details you submit — typically your name, phone number, email, and delivery or collection notes — so we can confirm the job, take payment, and deliver or hold it for pickup at Karen Green, Langata Road.
        </p>
        <p>
          If you pay by M-Pesa, we store the transaction code you send us so we can match it to Paybill 767363 and mark the order as paid. We use that code only to confirm the payment.
        </p>
        <p>
          Artwork files you upload are kept with the order so the job can be printed. We do not sell those files. We do not use them for other customers.
        </p>
        <p>
          SerialPro is a separate browser tool. Artwork you open there stays in your browser unless you also send a file with a shop order.
        </p>
        <p>
          Questions about this page go to proinnovationtech@gmail.com.
        </p>
      </div>
    </div>
  );
}
