"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

function channelFor(href: string) {
  if (href.startsWith("tel:")) return "call" as const;
  if (href.startsWith("https://wa.me/") || href.startsWith("https://api.whatsapp.com/")) return "whatsapp" as const;
  return null;
}

// One listener counts every WhatsApp and phone link, so new buttons are tracked without extra wiring.
export function ContactClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const channel = channelFor(anchor.getAttribute("href") ?? "");
      if (!channel) return;
      const path = window.location.pathname;
      const label = (anchor.dataset.track || anchor.getAttribute("aria-label") || anchor.textContent || "").trim().slice(0, 120);
      track(channel === "call" ? "Call click" : "WhatsApp click", { path, label });
      const payload = JSON.stringify({ channel, path, label });
      if (!navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }))) {
        void fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => undefined);
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
