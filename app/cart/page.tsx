import type { Metadata } from "next";
import { CartView } from "@/components/store/CartView";

export const metadata: Metadata = { title: "Cart", description: "Review your print order before M-Pesa payment." };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <CartView />
    </div>
  );
}
