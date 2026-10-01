import type { Metadata } from "next";
import { OrderForm } from "@/components/store/OrderForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay your print order by M-Pesa Paybill and send the transaction code.",
};

export default function OrderPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Pay and place the order</h1>
        <p className="mt-3 text-neutral-600">Pay the total on the Paybill, using your full name as the account, then paste the M-Pesa code. We print after the payment matches.</p>
      </div>
      <OrderForm />
    </div>
  );
}
