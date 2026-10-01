"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import type { PriceGroup } from "@/lib/printshop/pricebook";
import {
  applySearchHint,
  defaultSpec,
  formatKes,
  groupFacetKeys,
  priceEntry,
  quoteProduct,
  turnaroundChoices,
  type QuoteSpec,
  type Turnaround,
} from "@/lib/printshop/pricing";
import { useCart } from "./CartProvider";

const fieldClass = "mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold";

export function OrderPanel({ product, initialQuantity, hint }: { product: CatalogProduct; initialQuantity?: number; hint?: string }) {
  const entry = priceEntry(product.slug);
  const starting = defaultSpec(product);
  const cart = useCart();
  const [spec, setSpec] = useState<QuoteSpec | null>(() => (starting ? applySearchHint(starting, hint, initialQuantity) : null));
  const [added, setAdded] = useState(false);
  const [repeatNote, setRepeatNote] = useState("");

  const priced = useMemo(() => (spec ? quoteProduct(product, spec) : null), [product, spec]);

  if (!entry || !spec || !priced) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-semibold text-neutral-500">Custom quote</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">Tell us the size, quantity and date. We reply with one fixed price.</p>
        <Link href={`/contact?product=${product.slug}`} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-neutral-950 px-5 font-semibold text-white">
          Request a quote
        </Link>
      </div>
    );
  }

  function patch(partial: Partial<QuoteSpec>) {
    setSpec((current) => (current ? { ...current, ...partial } : current));
    setAdded(false);
  }

  function repeatLast() {
    const raw = localStorage.getItem(`proprint-last:${product.slug}`);
    if (!raw) {
      setRepeatNote("No saved specification yet.");
      return;
    }
    try {
      const saved = JSON.parse(raw) as QuoteSpec;
      setSpec(saved);
      setRepeatNote("");
      setAdded(false);
    } catch {
      setRepeatNote("No saved specification yet.");
    }
  }

  const facets = entry.groups ? groupFacetKeys(entry.groups) : null;
  const activeGroup = entry.groups?.find((group) => group.label === spec.group) ?? entry.groups?.[0];

  return (
    <form
      className="border border-neutral-200 bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        localStorage.setItem(`proprint-last:${product.slug}`, JSON.stringify(spec));
        cart.add({
          slug: product.slug,
          title: product.title,
          quantity: priced.quantity,
          unitKes: priced.unitKes,
          totalKes: priced.totalKes,
          summary: priced.summary,
          spec,
        });
        setAdded(true);
        cart.openDrawer();
      }}
    >
      <p className="font-mono text-3xl tabular-nums text-neutral-950">{formatKes(priced.totalKes)}</p>
      <p className="mt-1 text-sm text-neutral-500">{priced.summary || "Standard specification"}</p>

      {entry.groups && activeGroup && (
        <GroupControl groups={entry.groups} facets={facets} groupLabel={activeGroup.label} onChange={(group) => patch({ group })} />
      )}

      {entry.size && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">
            Width ({entry.size.unit})
            <input
              type="number"
              min={entry.size.minW}
              max={entry.size.maxW}
              step="0.1"
              value={spec.width ?? entry.size.minW}
              onChange={(event) => patch({ width: Number(event.target.value) })}
              className={fieldClass}
            />
          </label>
          <label className="text-sm font-semibold">
            Height ({entry.size.unit})
            <input
              type="number"
              min={entry.size.minH}
              max={entry.size.maxH}
              step="0.1"
              value={spec.height ?? entry.size.minH}
              onChange={(event) => patch({ height: Number(event.target.value) })}
              className={fieldClass}
            />
          </label>
        </div>
      )}

      {entry.book && (
        <BookControl entry={entry.book} spec={spec} onChange={patch} />
      )}

      {entry.variations && <AttributeControl variations={entry.variations} attrs={spec.attrs ?? {}} onChange={(attrs) => patch({ attrs })} />}

      <QuantityControl
        quantity={priced.quantity}
        tiers={activeGroup?.tiers}
        min={entry.minQty}
        max={entry.maxQty}
        step={entry.step}
        onChange={(quantity) => patch({ quantity })}
      />

      {(entry.options ?? []).map((option) => (
        <label key={option.name} className="mt-4 block text-sm font-semibold">
          {option.name}
          <select
            className={fieldClass}
            value={spec.options?.[option.name] ?? ""}
            onChange={(event) => patch({ options: { ...spec.options, [option.name]: event.target.value } })}
          >
            {!option.choices.some((choice) => choice.add === 0) && <option value="">None</option>}
            {option.choices.map((choice) => (
              <option key={choice.label} value={choice.label}>
                {choice.label}
                {choice.add > 0 ? ` · +${choice.add <= 40 ? `${choice.add}/pc` : formatKes(choice.add)}` : ""}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label className="mt-4 block text-sm font-semibold">
        Turnaround
        <select className={fieldClass} value={spec.turnaround} onChange={(event) => patch({ turnaround: event.target.value as Turnaround })}>
          {turnaroundChoices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
              {choice.addKes ? ` · +${formatKes(choice.addKes)}` : ""}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="mt-5 hidden min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff0030] font-bold text-white md:inline-flex">
        <ShoppingBag className="size-4" /> Add to cart
      </button>
      <button type="submit" className="fixed inset-x-4 bottom-4 z-30 h-12 rounded-full bg-[#ff0030] text-sm font-bold text-white md:hidden">
        Add to cart · {formatKes(priced.totalKes)}
      </button>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <button type="button" className="font-semibold text-neutral-500" onClick={repeatLast}>
          Use last specification
        </button>
        {added && (
          <Link href="/cart" className="inline-flex items-center gap-1 font-semibold text-neutral-950">
            <Check className="size-4" /> View cart
          </Link>
        )}
      </div>
      {repeatNote && <p className="mt-2 text-xs text-neutral-500">{repeatNote}</p>}
      <p className="mt-3 text-xs leading-5 text-neutral-500">Send a PDF or PNG after payment. We check the file before printing and write back if it will not print cleanly.</p>
    </form>
  );
}

function GroupControl({
  groups,
  facets,
  groupLabel,
  onChange,
}: {
  groups: PriceGroup[];
  facets: ReturnType<typeof groupFacetKeys>;
  groupLabel: string;
  onChange: (label: string) => void;
}) {
  if (facets) {
    const current = facets.rows[groups.findIndex((group) => group.label === groupLabel)] ?? facets.rows[0];
    return (
      <div className="mt-4 grid gap-3">
        {facets.keys.map((key) => {
          const values = [...new Set(facets.rows.map((row) => row[key]))];
          return (
            <label key={key} className="text-sm font-semibold">
              {key}
              <select
                className={fieldClass}
                value={current[key]}
                onChange={(event) => {
                  const next = { ...current, [key]: event.target.value };
                  const index = facets.rows.findIndex((row) => facets.keys.every((facet) => row[facet] === next[facet]));
                  if (index >= 0) onChange(groups[index].label);
                }}
              >
                {values.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    );
  }

  if (groups.length <= 4) {
    return (
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Option</legend>
        <div className="mt-2 grid gap-2">
          {groups.map((group) => (
            <button
              key={group.label}
              type="button"
              onClick={() => onChange(group.label)}
              className={`min-h-11 rounded-xl border px-3 text-left text-sm font-semibold ${group.label === groupLabel ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200"}`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <label className="mt-4 block text-sm font-semibold">
      Option
      <select className={fieldClass} value={groupLabel} onChange={(event) => onChange(event.target.value)}>
        {groups.map((group) => (
          <option key={group.label}>{group.label}</option>
        ))}
      </select>
    </label>
  );
}

function QuantityControl({
  quantity,
  tiers,
  min,
  max,
  step,
  onChange,
}: {
  quantity: number;
  tiers?: { qty: number; total: number }[];
  min: number;
  max: number;
  step: number;
  onChange: (quantity: number) => void;
}) {
  const published = tiers?.map((tier) => tier.qty) ?? [];
  const choices = published.length && !published.includes(quantity) ? [...published, quantity].sort((a, b) => a - b) : published;
  if (choices.length > 0 && choices.length <= 6) {
    return (
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Quantity</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {choices.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`min-h-11 rounded-xl border text-sm font-semibold tabular-nums ${quantity === value ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200"}`}
            >
              {value.toLocaleString("en-KE")}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }
  if (choices.length > 0) {
    return (
      <label className="mt-4 block text-sm font-semibold">
        Quantity
        <select className={fieldClass} value={choices.includes(quantity) ? quantity : choices[0]} onChange={(event) => onChange(Number(event.target.value))}>
          {choices.map((value) => (
            <option key={value} value={value}>
              {value.toLocaleString("en-KE")}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className="mt-4 block text-sm font-semibold">
      Quantity
      <input type="number" min={min} max={max} step={step} value={quantity} onChange={(event) => onChange(Number(event.target.value))} className={fieldClass} />
    </label>
  );
}

function AttributeControl({
  variations,
  attrs,
  onChange,
}: {
  variations: { price: number; attrs: Record<string, string> }[];
  attrs: Record<string, string>;
  onChange: (attrs: Record<string, string>) => void;
}) {
  const names: string[] = [];
  for (const variation of variations) {
    for (const name of Object.keys(variation.attrs)) {
      if (!names.includes(name)) names.push(name);
    }
  }
  const visible = names.slice(0, 2);
  const hidden = names.slice(2);
  return (
    <div className="mt-4 grid gap-3">
      {visible.map((name) => (
        <AttrSelect key={name} name={name} variations={variations} attrs={attrs} onChange={onChange} />
      ))}
      {hidden.length > 0 && (
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-neutral-600">More options</summary>
          <div className="mt-3 grid gap-3">
            {hidden.map((name) => (
              <AttrSelect key={name} name={name} variations={variations} attrs={attrs} onChange={onChange} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function AttrSelect({
  name,
  variations,
  attrs,
  onChange,
}: {
  name: string;
  variations: { attrs: Record<string, string> }[];
  attrs: Record<string, string>;
  onChange: (attrs: Record<string, string>) => void;
}) {
  const values = [...new Set(variations.map((item) => item.attrs[name]).filter(Boolean))];
  return (
    <label className="text-sm font-semibold">
      {name}
      <select className={fieldClass} value={attrs[name] ?? values[0]} onChange={(event) => onChange({ ...attrs, [name]: event.target.value })}>
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </label>
  );
}

function BookControl({
  entry,
  spec,
  onChange,
}: {
  entry: NonNullable<ReturnType<typeof priceEntry>>["book"];
  spec: QuoteSpec;
  onChange: (partial: Partial<QuoteSpec>) => void;
}) {
  if (!entry) return null;
  const colourMatters = entry.sizes.some((size) => size.bw !== size.color) || entry.papers.some((paper) => paper.bw !== paper.color);
  return (
    <div className="mt-4 grid gap-3">
      <label className="text-sm font-semibold">
        Size
        <select className={fieldClass} value={spec.size} onChange={(event) => onChange({ size: event.target.value })}>
          {entry.sizes.map((size) => (
            <option key={size.name}>{size.name}</option>
          ))}
        </select>
      </label>
      {colourMatters && (
        <fieldset>
          <legend className="text-sm font-semibold">Colour</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["color", "bw"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ color: value })}
                className={`min-h-11 rounded-xl border text-sm font-semibold ${(spec.color ?? "color") === value ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200"}`}
              >
                {value === "color" ? "Colour" : "Black and white"}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {entry.perPage && (
        <label className="text-sm font-semibold">
          Pages
          <input type="number" min={4} max={400} value={spec.pages ?? 32} onChange={(event) => onChange({ pages: Number(event.target.value) })} className={fieldClass} />
        </label>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-neutral-600">Cover and binding</summary>
        <div className="mt-3 grid gap-3">
          {entry.papers.length > 0 && (
            <label className="text-sm font-semibold">
              Paper
              <select className={fieldClass} value={spec.paper} onChange={(event) => onChange({ paper: event.target.value })}>
                {entry.papers.map((paper) => (
                  <option key={paper.name}>{paper.name}</option>
                ))}
              </select>
            </label>
          )}
          {entry.covers.length > 0 && (
            <label className="text-sm font-semibold">
              Cover
              <select className={fieldClass} value={spec.cover} onChange={(event) => onChange({ cover: event.target.value })}>
                {entry.covers.map((cover) => (
                  <option key={cover.name}>{cover.name}</option>
                ))}
              </select>
            </label>
          )}
          {entry.bindings.length > 0 && (
            <label className="text-sm font-semibold">
              Binding
              <select className={fieldClass} value={spec.binding} onChange={(event) => onChange({ binding: event.target.value })}>
                {entry.bindings.map((binding) => (
                  <option key={binding.name}>{binding.name}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </details>
    </div>
  );
}
