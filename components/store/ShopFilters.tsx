"use client";

import { useRouter } from "next/navigation";
import { shopGroups } from "@/lib/printshop/catalog";

const bands = [
  ["all", "Any price"],
  ["under-1000", "Under KES 1,000"],
  ["mid", "KES 1,000–10,000"],
  ["premium", "Over KES 10,000"],
] as const;

export function ShopFilters({ group, band, q }: { group: string; band: string; q?: string }) {
  const router = useRouter();

  function go(nextGroup: string, nextBand: string) {
    const params = new URLSearchParams();
    if (nextGroup !== "all") params.set("group", nextGroup);
    if (nextBand !== "all") params.set("band", nextBand);
    if (q) params.set("q", q);
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <label className="text-sm text-neutral-600">
        <span className="sr-only">Category</span>
        <select
          value={group}
          onChange={(event) => go(event.target.value, band)}
          className="h-11 rounded-full border border-neutral-200 bg-white px-4 pr-8 text-sm text-neutral-950 outline-none"
        >
          <option value="all">All categories</option>
          {shopGroups.map((item) => (
            <option key={item.slug} value={item.slug}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm text-neutral-600">
        <span className="sr-only">Price</span>
        <select
          value={band}
          onChange={(event) => go(group, event.target.value)}
          className="h-11 rounded-full border border-neutral-200 bg-white px-4 pr-8 text-sm text-neutral-950 outline-none"
        >
          {bands.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
