import { clsx } from "clsx";

type Tone = "brand" | "accent" | "success" | "sun" | "neutral" | "dark";

const TONES: Record<Tone, string> = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-700",
    success: "bg-emerald-50 text-emerald-700",
    sun: "bg-amber-50 text-amber-700",
    neutral: "bg-slate-100 text-slate-700",
    dark: "bg-white/10 text-white",
};

const DOT: Record<Tone, string> = {
    brand: "bg-brand-500",
    accent: "bg-accent-500",
    success: "bg-emerald-500",
    sun: "bg-amber-500",
    neutral: "bg-slate-400",
    dark: "bg-white/70",
};

export function Badge({
    children,
    tone = "neutral",
    icon,
    pulse = false,
    className,
}: {
    children: React.ReactNode;
    tone?: Tone;
    icon?: React.ReactNode;
    pulse?: boolean;
    className?: string;
}) {
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                TONES[tone],
                className
            )}
        >
            {pulse && (
                <span className={clsx("size-2 rounded-full", DOT[tone], "animate-soft-pulse")} />
            )}
            {icon}
            {children}
        </span>
    );
}
