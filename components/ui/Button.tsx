import { clsx } from "clsx";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "success" | "outline" | "dark";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
    primary:
        "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30",
    secondary:
        "bg-white text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    success:
        "bg-success-500 text-white hover:bg-success-600 shadow-lg shadow-emerald-500/20",
    outline:
        "bg-white/0 border border-white/30 text-white hover:bg-white/10",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
};

const SIZES: Record<Size, string> = {
    sm: "h-9 px-4 text-sm rounded-lg gap-1.5",
    md: "h-11 px-5 text-sm rounded-xl gap-2",
    lg: "h-12 px-6 text-base rounded-xl gap-2",
    xl: "h-14 px-8 text-lg rounded-2xl gap-2.5",
};

interface BaseProps {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    className?: string;
    children: React.ReactNode;
    fullWidth?: boolean;
}

const baseClasses =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed select-none hover:scale-[1.02] active:scale-[0.98] focus-visible:scale-[1.02]";

interface ButtonProps
    extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
    asChild?: false;
}

interface LinkProps extends BaseProps {
    asChild: true;
    href: string;
    target?: string;
    rel?: string;
}

type Props = ButtonProps | LinkProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = "primary", size = "md", loading, className, children, fullWidth, ...rest },
    ref
) {
    return (
        <button
            ref={ref}
            className={clsx(
                baseClasses,
                VARIANTS[variant],
                SIZES[size],
                fullWidth && "w-full",
                className
            )}
            disabled={loading || rest.disabled}
            {...rest}
        >
            {loading ? <Loader2 className="size-4 animate-spin" /> : children}
        </button>
    );
});

interface ButtonLinkProps extends BaseProps {
    href: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    "aria-label"?: string;
}

export function ButtonLink({
    variant = "primary",
    size = "md",
    className,
    children,
    fullWidth,
    href,
    onClick,
    target,
    rel,
    ...rest
}: ButtonLinkProps) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
    const cls = clsx(
        baseClasses,
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
    );
    if (isExternal) {
        return (
            <a href={href} className={cls} onClick={onClick} target={target} rel={rel} {...rest}>
                {children}
            </a>
        );
    }
    return (
        <Link href={href} className={cls} onClick={onClick} {...rest}>
            {children}
        </Link>
    );
}
