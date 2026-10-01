import Link from "next/link";
import { Logo } from "@/components/Logo";
import { business } from "@/lib/config";
import { shopGroups } from "@/lib/printshop/catalog";

export function StoreFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo tone="shop" size={32} />
          <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600">Made-to-order printing in Nairobi, delivered across Kenya.</p>
          <p className="mt-4 text-sm text-neutral-600">
            <a className="font-semibold text-neutral-950" href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a>
            <br />
            Paybill <span className="font-mono tabular-nums">{business.paybill}</span>
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-bold">Shop</h2>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              {shopGroups.slice(0, 6).map((group) => (
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
              <Link href="/contact" className="hover:text-neutral-950">Ask for a quote</Link>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold">Company</h2>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              <Link href="/about" className="hover:text-neutral-950">About</Link>
              <Link href="/print-on-demand" className="hover:text-neutral-950">Print on demand</Link>
              <Link href="/legal/privacy" className="hover:text-neutral-950">Privacy</Link>
              <Link href="/terms" className="hover:text-neutral-950">Print terms</Link>
              <Link href="/tools/serialpro" className="hover:text-neutral-950">Production tools</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-8 text-xs text-neutral-500 sm:px-6">© {new Date().getFullYear()} {business.name}</div>
    </footer>
  );
}
