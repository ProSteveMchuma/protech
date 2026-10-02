"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { shopAuth } from "@/lib/firebase-client";

export default function SignOutPage() {
  useEffect(() => {
    let cancelled = false;
    async function leave() {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
      await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
      await signOut(shopAuth()).catch(() => undefined);
      if (!cancelled) window.location.replace("/");
    }
    void leave();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight">Signing out</h1>
    </div>
  );
}
