"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

export function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                setError(body.error || "Login failed");
                return;
            }
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-press">
            <div className="imposition-grid pointer-events-none absolute inset-0 opacity-30" />
            <div className="relative mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-press-panel p-8">
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4 text-white">
                        <Logo variant="mark" size={56} />
                    </div>
                    <h1 className="text-2xl font-black text-white">Admin access</h1>
                    <p className="mt-1 text-sm text-slate-400">Authorized staff only.</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
                        <input
                            type="password"
                            className="w-full rounded-xl border border-white/12 bg-press py-3.5 pr-4 pl-10 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-sm font-medium text-rose-300" role="alert">
                            {error}
                        </p>
                    )}
                    <Button type="submit" loading={loading} size="lg" fullWidth>
                        Unlock dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
}
