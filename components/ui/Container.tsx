import { clsx } from "clsx";

export function Container({
    children,
    className,
    size = "default",
}: {
    children: React.ReactNode;
    className?: string;
    size?: "narrow" | "default" | "wide";
}) {
    const max =
        size === "narrow" ? "max-w-3xl" : size === "wide" ? "max-w-7xl" : "max-w-6xl";
    return (
        <div className={clsx("mx-auto px-4 sm:px-6 lg:px-8", max, className)}>
            {children}
        </div>
    );
}
