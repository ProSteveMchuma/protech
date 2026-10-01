import type { Metadata } from "next";
import { OrderForm } from "@/components/store/OrderForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose delivery or collection at Karen Green, Langata Road, then pay by M-Pesa Paybill.",
};

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:py-14">
      <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">Secure checkout</h1>
      <OrderForm />
    </div>
  );
}
