import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import { shopGroups } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, shelfKes } from "@/lib/printshop/pricing";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const from = shelfKes(product);
  const group = shopGroups.find((item) => item.slug === product.group);
  return (
    <Link href={`/product/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition duration-500 hover:border-red-200 hover:shadow-2xl">
      <div className="relative aspect-square overflow-hidden bg-[#f8f6f4]">
        <Image src={productImage(product)} alt="" width={800} height={800} className="size-full object-cover transition duration-700 ease-out group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ff0030]/80">{group?.nav ?? product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-tight tracking-tight text-neutral-950 group-hover:text-[#ff0030]">{product.title}</h3>
        <p className="mb-3 mt-auto pt-3 font-mono text-lg font-black tabular-nums text-neutral-950 md:text-xl">{from ? formatKes(from) : "Quoted"}</p>
        <span className="flex h-11 items-center justify-center rounded-xl bg-neutral-950 text-[11px] font-bold uppercase tracking-widest text-white transition group-hover:bg-[#ff0030]">Choose options</span>
      </div>
    </Link>
  );
}
