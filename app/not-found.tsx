import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 py-20 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ff0030]">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">That page is not in the catalogue.</h1>
        <p className="mt-3 text-neutral-600">Go back to the shop, or tell us what you were trying to print.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="inline-flex h-11 items-center rounded-2xl bg-[#ff0030] px-4 font-semibold text-white">Browse products</Link>
          <Link href="/contact" className="inline-flex h-11 items-center rounded-2xl border border-neutral-200 px-4 font-semibold">Contact</Link>
        </div>
      </div>
    </section>
  );
}
