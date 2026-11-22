"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag } from "lucide-react";
import type { CatalogProduct } from "@/lib/printshop/catalog";
import type { PriceGroup } from "@/lib/printshop/pricebook";
import {
  allowsRush,
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
import { whatsappHref, whatsappOrderMessage } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

const fieldClass = "mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold";

export function OrderPanel({ product, initialQuantity, hint }: { product: CatalogProduct; initialQuantity?: number; hint?: string }) {
  const entry = priceEntry(product.slug);
  const starting = defaultSpec(product);
  const cart = useCart();
  const [spec, setSpec] = useState<QuoteSpec | null>(() => (starting ? applySearchHint(starting, hint, initialQuantity) : null));
  const [added, setAdded] = useState(false);
  const [repeatNote, setRepeatNote] = useState("");

  const turnaround: Turnaround = spec && spec.turnaround === "rush" && !allowsRush(product.slug, spec) ? "standard" : spec?.turnaround ?? "standard";
  const priced = useMemo(() => (spec ? quoteProduct(product, { ...spec, turnaround }) : null), [product, spec, turnaround]);

  if (!entry || !spec || !priced) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-semibold text-neutral-500">Custom quote</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">Tell us the size, quantity and date. We reply with one fixed price.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={whatsappHref(whatsappOrderMessage({ title: product.title, url: productUrl(product.slug) }) + "\nSize, quantity and date: ")}
            data-track="Quote on WhatsApp"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#128C7E] px-5 font-semibold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppGlyph /> Get a quote on WhatsApp
          </a>
          <Link href={`/contact?product=${product.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-neutral-300 px-5 font-semibold text-neutral-950">
            Use the form
          </Link>
        </div>
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
  const orderOnWhatsapp = whatsappHref(
    whatsappOrderMessage({
      title: product.title,
      summary: priced.summary,
      quantity: priced.quantity,
      turnaround: turnaroundChoices.find((choice) => choice.id === turnaround)?.label,
      totalKes: priced.totalKes,
      url: productUrl(product.slug),
    }),
  );
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
          spec: { ...spec, quantity: priced.quantity, turnaround: priced.job.turnaround },
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
                {choice.add > 0 ? ` · +${choice.per === "piece" ? `${choice.add}/pc` : formatKes(choice.add)}` : ""}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label className="mt-4 block text-sm font-semibold">
        Turnaround
        <select className={fieldClass} value={turnaround} onChange={(event) => patch({ turnaround: event.target.value as Turnaround })}>
          {turnaroundChoices.filter((choice) => choice.id !== "rush" || allowsRush(product.slug, spec)).map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
              {choice.addKes ? ` · +${formatKes(choice.addKes)}` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-5 hidden gap-3 md:grid md:grid-cols-2">
        <a href={orderOnWhatsapp} data-track="Order on WhatsApp" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#128C7E] font-bold text-white" target="_blank" rel="noopener noreferrer">
          <WhatsAppGlyph /> Order on WhatsApp
        </a>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff0030] font-bold text-white">
          <ShoppingBag className="size-4" /> Add to cart
        </button>
      </div>
      <p className="mt-3 hidden text-center text-xs text-neutral-500 md:block">No payment needed to ask. We confirm the artwork and price first.</p>
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-neutral-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a href={orderOnWhatsapp} data-track="Order on WhatsApp" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#128C7E] text-sm font-bold text-white" target="_blank" rel="noopener noreferrer">
          <WhatsAppGlyph /> WhatsApp
        </a>
        <button type="submit" className="h-12 rounded-full bg-[#ff0030] text-sm font-bold text-white">
          Cart · {formatKes(priced.totalKes)}
        </button>
      </div>
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

function productUrl(slug: string) {
  return `https://www.proinnovationtech.co.ke/product/${slug}`;
}

function WhatsAppGlyph() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.9.9-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}
