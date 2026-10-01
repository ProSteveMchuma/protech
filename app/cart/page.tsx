import type { Metadata } from "next";
import { CartView } from "@/components/store/CartView";

export const metadata: Metadata = { title: "Cart", description: "Review your print order, then choose delivery or collection." };

export default function CartPage() {
  return (
    <div className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-8 lg:px-12 lg:pb-14">
        <CartView />
      </div>
    </div>
  );
}
