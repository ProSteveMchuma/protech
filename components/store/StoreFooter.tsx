import Link from "next/link";
import { business } from "@/lib/config";
import { shopGroups } from "@/lib/printshop/catalog";
import { FREE_DELIVERY_FROM_KES, formatKes } from "@/lib/printshop/pricing";

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: "Print products",
    links: shopGroups.slice(0, 5).map((group) => [group.label, `/category/${group.slug}`]),
  },
  {
    title: "Apparel and gifts",
    links: [
      ["Apparel & T-Shirts", "/category/apparel"],
      ["Mugs & Promo", "/category/mugs-promo"],
      ["Business packages", "/packages"],
      ["Print on demand", "/print-on-demand"],
    ],
  },
  {
    title: "Services and delivery",
    links: [
      ["Same-day Nairobi printing", "/shop"],
      ["All 47 counties", "/print-on-demand#delivery"],
      ["Free delivery rules", "/print-on-demand#delivery"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Account", "/account"],
      ["Production tools", "/tools/serialpro"],
      ["Privacy", "/legal/privacy"],
    ],
  },
];

export function StoreFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        {[
          ["Same-day printing", "Order before 10:00 for selected Nairobi jobs"],
          ["Free delivery", `On orders over ${formatKes(FREE_DELIVERY_FROM_KES)}`],
          ["All 47 counties", "Nairobi KES 400 · elsewhere KES 850"],
          ["Secure payment", "M-Pesa Paybill, with invoicing on request"],
        ].map(([title, copy]) => (
          <div key={title}>
            <p className="font-semibold text-white">{title}</p>
            <p className="mt-1 text-sm leading-6">{copy}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="text-lg font-black text-white">ProPrint</p>
            <p className="mt-3 max-w-sm text-sm leading-6">High-quality prints, delivered to your door anywhere in Kenya. Made to order by {business.name}.</p>
            <p className="mt-4 text-sm">
              <a className="font-semibold text-white" href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a>
              <br />
              Nairobi production desk
              <br />
              Paybill <span className="font-mono tabular-nums text-white">{business.paybill}</span>
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-bold text-white">{column.title}</h2>
                <div className="mt-3 grid gap-2 text-sm">
                  {column.links.map(([label, href]) => (
                    <Link key={label} href={href} className="hover:text-white">{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 text-xs sm:px-6">© {new Date().getFullYear()} {business.name}. Prices are in Kenyan shillings and update when you change quantity.</div>
    </footer>
  );
}
