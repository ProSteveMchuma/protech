import Link from "next/link";
import { Logo } from "@/components/Logo";
import { business } from "@/lib/config";
import { shopGroups } from "@/lib/printshop/catalog";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";

export function StoreFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo tone="shop" size={32} />
          <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">Made-to-order printing in Nairobi. You see the price, pay by M-Pesa, and we deliver across Kenya.</p>
          <p className="mt-4 text-sm text-neutral-700">
            <a className="font-semibold text-neutral-950" href={whatsappHref()} target="_blank" rel="noopener noreferrer">WhatsApp {whatsappDisplay()}</a>
            <br />
            <a className="font-semibold text-neutral-950" href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a>
            <br />
            Paybill <span className="font-mono tabular-nums">{business.paybill}</span>
            <br />
            Monday–Friday 8:00–18:00, Saturday 9:00–16:00
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-bold">Shop</h2>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              {shopGroups.map((group) => (
                <Link key={group.slug} href={`/category/${group.slug}`} className="hover:text-neutral-950">{group.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Orders</h2>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              <Link href="/shop" className="hover:text-neutral-950">All products</Link>
              <Link href="/packages" className="hover:text-neutral-950">Packages</Link>
              <Link href="/cart" className="hover:text-neutral-950">Cart</Link>
              <Link href="/order" className="hover:text-neutral-950">Checkout</Link>
              <Link href="/contact" className="hover:text-neutral-950">Ask for a quote</Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Company</h2>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              <Link href="/about" className="hover:text-neutral-950">About</Link>
              <Link href="/print-on-demand" className="hover:text-neutral-950">How ordering works</Link>
              <Link href="/legal/privacy" className="hover:text-neutral-950">Privacy</Link>
              <Link href="/terms" className="hover:text-neutral-950">Print terms</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 pb-20 text-xs text-neutral-500 sm:px-6">
        <p>© {new Date().getFullYear()} {business.name}</p>
        <p>Nairobi production · delivery to all 47 counties</p>
      </div>
    </footer>
  );
}
