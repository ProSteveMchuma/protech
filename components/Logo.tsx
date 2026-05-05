import { clsx } from "clsx";

interface LogoProps {
    variant?: "mark" | "lockup";
    /** Size hint in px for the mark height (lockup scales accordingly). */
    size?: number;
    /** Tone overrides accent dot color. Defaults to emerald success. */
    accent?: "emerald" | "cyan" | "amber" | "white";
    className?: string;
}

const ACCENT_HEX: Record<NonNullable<LogoProps["accent"]>, string> = {
    emerald: "#10B981",
    cyan: "#06B6D4",
    amber: "#F59E0B",
    white: "#FFFFFF",
};

/**
 * Pro Remote Tasks logo. Geometric monogram "PRT" with an accent dot.
 * Inline SVG, two-tone (currentColor + accent), scales perfectly.
 */
export function Logo({
    variant = "mark",
    size = 32,
    accent = "emerald",
    className,
}: LogoProps) {
    const accentColor = ACCENT_HEX[accent];

    const Mark = (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={clsx("shrink-0", className)}
            aria-hidden="true"
        >
            {/* Rounded square plate */}
            <rect width="64" height="64" rx="16" fill="currentColor" />

            {/* P — top-left */}
            <path
                d="M14 16h7.4c3.4 0 5.7 2 5.7 5 0 3-2.3 5-5.7 5H17v6h-3V16zm3 7.2h4c1.8 0 2.9-.9 2.9-2.2 0-1.4-1.1-2.2-2.9-2.2h-4v4.4z"
                fill="white"
            />

            {/* R — middle-left */}
            <path
                d="M30.5 16h7.5c3.5 0 5.7 1.9 5.7 4.7 0 2.1-1.2 3.6-3.1 4.3l3.7 7H40.6l-3-6.4h-4.1V32h-3V16zm3 7h3.9c1.7 0 2.9-.7 2.9-2 0-1.3-1.2-2-2.9-2h-3.9v4z"
                fill="white"
            />

            {/* T — bottom, spans wider with extended cross-stroke */}
            <path
                d="M14 38h36v3H35v9h-3v-9H14v-3z"
                fill="white"
            />

            {/* Accent dot — bottom right, "task complete" */}
            <circle cx="50" cy="48.5" r="4" fill={accentColor} />
        </svg>
    );

    if (variant === "mark") return Mark;

    // Lockup: mark + wordmark
    return (
        <div className={clsx("inline-flex items-center gap-2.5", className)}>
            {Mark}
            <div className="flex flex-col leading-none">
                <span className="font-display text-[1.05em] font-bold tracking-tight">
                    Pro Remote Tasks
                </span>
                <span className="text-[0.62em] uppercase tracking-[0.18em] text-current opacity-60 font-semibold mt-0.5">
                    Vetted Kenyan talent
                </span>
            </div>
        </div>
    );
}
