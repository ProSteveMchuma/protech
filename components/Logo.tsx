export function Logo({ variant = "lockup", size = 36, tone = "studio" }: { variant?: "mark" | "lockup"; size?: number; tone?: "studio" | "shop" }) {
  const shop = tone === "shop";
  const mark = (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="8" fill={shop ? "#ff0030" : "#071019"} />
      {shop ? null : <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" fill="none" stroke="#67e8f9" strokeOpacity="0.45" />}
      <path d="M10 23V9h7.2a4.2 4.2 0 0 1 0 8.4H14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 9.5 26.5 14 22 14" fill="none" stroke={shop ? "white" : "#67e8f9"} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
  if (variant === "mark") return mark;
  return (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      <span className="leading-none">
        <b className={`block text-base font-black tracking-[-.03em] ${shop ? "text-neutral-950" : "text-white"}`}>ProPrint</b>
        <span className={`mt-1 block text-[10px] font-semibold uppercase tracking-[.14em] ${shop ? "text-neutral-500" : "text-slate-500"}`}>{shop ? "Nairobi" : "by Pro Innovation"}</span>
      </span>
    </span>
  );
}
