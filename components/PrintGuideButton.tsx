"use client";

import { Printer } from "lucide-react";
import { Button } from "./ui/Button";

export function PrintGuideButton({
    label = "Save as PDF",
    variant = "primary",
}: {
    label?: string;
    variant?: "primary" | "secondary" | "outline" | "dark";
}) {
    return (
        <Button
            type="button"
            onClick={() => window.print()}
            variant={variant}
            size="lg"
            data-print-hide
        >
            <Printer className="size-5" />
            {label}
        </Button>
    );
}
