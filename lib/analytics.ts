"use client";

/**
 * Provider-agnostic client analytics. Fires events to our own /api/track
 * endpoint (captured server-side), and mirrors to PostHog/GA only if a public
 * key is configured. No key required for events to be captured.
 */

export type AnalyticsEvent =
    | "tool_opened"
    | "pdf_uploaded"
    | "output_downloaded"
    | "quote_copied"
    | "quote_printed"
    | "preset_applied"
    | "signup"
    | "login"
    | "checkout_started"
    | "payment_submitted"
    | "upgrade_prompt_shown";

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
    if (typeof window === "undefined") return;
    const body = JSON.stringify({ event, props, path: window.location.pathname });
    try {
        if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
        } else {
            void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
        }
    } catch {
        /* analytics must never break the app */
    }

    const globalWindow = window as unknown as { posthog?: { capture?: (e: string, p?: Record<string, unknown>) => void } };
    globalWindow.posthog?.capture?.(event, props);
}
