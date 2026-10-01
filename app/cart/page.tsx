import type { Metadata } from "next";
import { CartView } from "@/components/store/CartView";

export const metadata: Metadata = { title: "Cart", description: "Review your print order, then choose delivery or collection." };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-36 sm:px-6 lg:py-14">
      <CartView />
    </div>
  );
}
