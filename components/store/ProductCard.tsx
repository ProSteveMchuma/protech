import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, shelfKes } from "@/lib/printshop/pricing";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const from = shelfKes(product);
  return (
    <Link href={`/product/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Image src={productImage(product)} alt="" width={800} height={600} className="aspect-[4/3] w-full bg-neutral-100 object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold leading-6 text-neutral-950">{product.title}</h3>
        <p className="mt-3 font-mono text-sm font-bold tabular-nums text-neutral-950">{from ? `From ${formatKes(from)}` : "Quote"}</p>
      </div>
    </Link>
  );
}
