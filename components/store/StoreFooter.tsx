import Link from "next/link";
import { Logo } from "@/components/Logo";
import { business, pickup } from "@/lib/config";
import { shopGroups } from "@/lib/printshop/catalog";
import { whatsappDisplay, whatsappHref } from "@/lib/whatsapp";

export function StoreFooter() {
  return (
    <footer className="bg-[#1f2937] text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-4 lg:px-12">
        <div className="space-y-5">
          <Link href="/" aria-label="ProPrint home"><Logo tone="shop-light" size={32} /></Link>
          <p className="max-w-xs text-sm leading-6 text-neutral-400">Made-to-order printing in Nairobi. The price is on the product. You pay by M-Pesa, then collect at the office or we deliver across Kenya.</p>
          <a href={whatsappHref()} className="inline-flex text-sm font-bold text-red-300" target="_blank" rel="noopener noreferrer">WhatsApp support: {whatsappDisplay()}</a>
          <p className="text-sm text-neutral-400">{pickup.address}<br />Monday–Friday 8:00–18:00, Saturday 9:00–16:00</p>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">Shop</h2>
          <ul className="space-y-3 text-sm">
            {shopGroups.map((group) => (
              <li key={group.slug}><Link href={`/category/${group.slug}`} className="text-neutral-400 hover:text-white">{group.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">Buying on ProPrint</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/shop" className="text-neutral-400 hover:text-white">All products</Link></li>
            <li><Link href="/cart" className="text-neutral-400 hover:text-white">Cart</Link></li>
            <li><Link href="/order" className="text-neutral-400 hover:text-white">Checkout</Link></li>
            <li><Link href="/print-on-demand" className="text-neutral-400 hover:text-white">How ordering works</Link></li>
            <li><Link href="/packages" className="text-neutral-400 hover:text-white">Software packages</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">Payment</h2>
          <span className="inline-flex rounded bg-white px-2 py-1 text-[10px] font-bold text-neutral-800">M-PESA PAYBILL</span>
          <p className="mt-3 font-mono text-sm tabular-nums text-white">{business.paybill}</p>
          <p className="mt-2 text-sm text-neutral-400">Account is your name. Paste the M-Pesa code at checkout. We confirm it before printing.</p>
          <h2 className="mb-3 mt-8 text-xs font-bold uppercase tracking-wider text-white">Need help?</h2>
          <a href={`mailto:${business.supportEmail}`} className="block text-sm text-neutral-400 hover:text-white">{business.supportEmail}</a>
          <Link href="/contact" className="mt-4 inline-flex rounded-lg bg-[#ff0030] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Contact support</Link>
        </div>
      </div>
      <div className="border-t border-neutral-800 px-4 py-8 pb-28 text-center text-xs text-neutral-500 md:pb-8">
        <p>© {new Date().getFullYear()} {business.name}</p>
        <p className="mt-2">
          <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
          <span className="mx-2">·</span>
          <Link href="/terms" className="hover:text-white">Print terms</Link>
          <span className="mx-2">·</span>
          <Link href="/about" className="hover:text-white">About</Link>
        </p>
      </div>
    </footer>
  );
}
