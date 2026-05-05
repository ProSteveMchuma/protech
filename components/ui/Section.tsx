import { clsx } from "clsx";
import { Container } from "./Container";

interface Props {
    children: React.ReactNode;
    id?: string;
    className?: string;
    tone?: "light" | "soft" | "dark" | "aurora";
    size?: "narrow" | "default" | "wide";
    spacing?: "sm" | "md" | "lg";
}

const TONES = {
    light: "bg-white text-slate-900",
    soft: "bg-slate-50 text-slate-900",
    dark: "bg-brand-950 text-white bg-grid",
    aurora: "bg-aurora text-slate-900",
} as const;

const SPACING = {
    sm: "py-14",
    md: "py-20 md:py-24",
    lg: "py-24 md:py-32",
} as const;

export function Section({
    children,
    id,
    className,
    tone = "light",
    size = "default",
    spacing = "md",
}: Props) {
    return (
        <section
            id={id}
            className={clsx(
                "relative overflow-hidden scroll-mt-24",
                TONES[tone],
                SPACING[spacing],
                className
            )}
        >
            <Container size={size}>{children}</Container>
        </section>
    );
}
