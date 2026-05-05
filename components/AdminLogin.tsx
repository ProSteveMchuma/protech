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
        <div className="min-h-screen flex items-center justify-center bg-brand-950 bg-grid relative overflow-hidden">
            <div className="absolute inset-0 bg-aurora-dark opacity-60 pointer-events-none" />
            <div className="bg-white p-8 rounded-3xl premium-shadow w-full max-w-md mx-4 relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-brand-950 mb-4">
                        <Logo variant="mark" size={56} />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-slate-900">Admin access</h1>
                    <p className="text-sm text-slate-500 mt-1">Authorized staff only.</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="relative">
                        <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 outline-none transition"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm font-medium" role="alert">
                            {error}
                        </p>
                    )}
                    <Button type="submit" loading={loading} variant="dark" size="lg" fullWidth>
                        Unlock dashboard
                    </Button>
                </form>
            </div>
        </div>
    );
}
