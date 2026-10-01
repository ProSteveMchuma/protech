import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import { productImage } from "@/lib/printshop/images";
import { formatKes, shelfKes } from "@/lib/printshop/pricing";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const from = shelfKes(product);
  return (
    <Link href={`/product/${product.slug}`} className="group flex h-full flex-col">
      <div className="overflow-hidden bg-[#f6f4f1]">
        <Image src={productImage(product)} alt="" width={800} height={600} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      </div>
      <h3 className="mt-4 line-clamp-2 text-[15px] font-medium leading-6 text-neutral-950">{product.title}</h3>
      <p className="mt-1 font-mono text-sm tabular-nums text-neutral-500">{from ? `From ${formatKes(from)}` : "Quoted"}</p>
    </Link>
  );
}
