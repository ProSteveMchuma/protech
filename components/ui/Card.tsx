import { clsx } from "clsx";

interface Props {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "elevated" | "dark" | "glass";
    padding?: "sm" | "md" | "lg";
}

const VARIANTS = {
    default: "bg-white border border-slate-200/70 shadow-sm",
    elevated:
        "bg-white border border-slate-200/70 premium-shadow premium-shadow-hover",
    dark: "bg-brand-950 text-white border border-white/10",
    glass: "glass",
} as const;

const PADDING = {
    sm: "p-5",
    md: "p-7",
    lg: "p-9 md:p-10",
} as const;

export function Card({
    children,
    className,
    variant = "default",
    padding = "md",
}: Props) {
    return (
        <div
            className={clsx(
                "rounded-3xl transition-colors",
                VARIANTS[variant],
                PADDING[padding],
                className
            )}
        >
            {children}
        </div>
    );
}
