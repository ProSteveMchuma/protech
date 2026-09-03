"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { track } from "@/lib/analytics";
import { FEATURE_LABELS, PLAN_LABELS, minimumPlanFor, type Feature } from "@/lib/entitlements";

/**
 * Renders children when the shop's plan unlocks `feature`; otherwise shows a
 * compact upgrade prompt. Used to gate paid tool add-ons (QR, branded PDF,
 * batch, multi-line, machine catalog) without hiding the free core tools.
 */
export function FeatureGate({ feature, children, compact = false }: { feature: Feature; children: ReactNode; compact?: boolean }) {
    const { can } = useAuth();
    const unlocked = can(feature);

    useEffect(() => {
        if (!unlocked) track("upgrade_prompt_shown", { feature });
    }, [unlocked, feature]);

    if (unlocked) return <>{children}</>;

    const plan = PLAN_LABELS[minimumPlanFor(feature)];

    return (
        <div className={`rounded-xl border border-cyan-300/30 bg-cyan-300/5 ${compact ? "p-3" : "p-4"}`}>
            <p className="flex items-center gap-2 text-sm font-bold text-cyan-100">
                <Lock className="size-4" aria-hidden="true" />
                {FEATURE_LABELS[feature]}
            </p>
            <p className="mt-1 text-xs text-slate-300">Included from the {plan} plan.</p>
            <Link href="/checkout" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-1.5 text-xs font-black text-slate-950 hover:bg-cyan-200">
                Upgrade to unlock
            </Link>
        </div>
    );
}
