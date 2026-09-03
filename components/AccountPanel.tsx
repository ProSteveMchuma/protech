"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Cloud, HardDrive } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { copyLocalSavesToCloud } from "@/lib/proprint/cloud-saves";
import { useLocalSaves } from "@/components/proprint/useLocalSaves";

const fieldClass =
    "mt-2 w-full rounded-lg border border-white/15 bg-press px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/15";

const credentialsSchema = z.object({
    email: z.string().trim().email("Enter a valid email").max(200),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const signUpSchema = credentialsSchema
    .extend({
        confirm: z.string().min(6, "Confirm your password").max(128),
    })
    .refine((values) => values.password === values.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    });

const resetSchema = z.object({
    email: z.string().trim().email("Enter a valid email").max(200),
});

type Mode = "signin" | "signup" | "reset";

export function AccountPanel() {
    const { user, ready, configured, signIn, signUp, signOutUser, sendReset } = useAuth();
    const [mode, setMode] = useState<Mode>("signin");

    if (!ready) {
        return (
            <div className="rounded-2xl border border-white/10 bg-press-panel p-8 text-sm text-slate-400">
                Checking shop account…
            </div>
        );
    }

    if (!configured) {
        return (
            <div className="rounded-2xl border border-white/10 bg-press-panel p-8">
                <h2 className="text-2xl font-black">Shop accounts are not configured.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                    SerialPro and QuotePro still save named setups in this browser. Cloud accounts need the public
                    Firebase web keys in the environment.
                </p>
            </div>
        );
    }

    if (user) {
        return <SignedInAccount email={user.email} uid={user.uid} onSignOut={() => void signOutUser()} />;
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-press-panel p-6 shadow-2xl sm:p-8">
            <div className="flex gap-2 text-xs font-bold">
                <ModeButton active={mode === "signin"} onClick={() => setMode("signin")}>
                    Sign in
                </ModeButton>
                <ModeButton active={mode === "signup"} onClick={() => setMode("signup")}>
                    Create account
                </ModeButton>
            </div>
            {mode === "signin" && <SignInForm onSubmit={signIn} onReset={() => setMode("reset")} />}
            {mode === "signup" && <SignUpForm onSubmit={signUp} />}
            {mode === "reset" && <ResetForm onSubmit={sendReset} onBack={() => setMode("signin")} />}
        </div>
    );
}

function SignedInAccount({
    email,
    uid,
    onSignOut,
}: {
    email: string | null;
    uid: string;
    onSignOut: () => void;
}) {
    const serial = useLocalSaves("serialpro");
    const quotes = useLocalSaves("quotepro");
    const localCount = serial.length + quotes.length;
    const [copied, setCopied] = useState("");
    const [copyError, setCopyError] = useState("");
    const [copying, setCopying] = useState(false);

    return (
        <div className="rounded-2xl border border-white/10 bg-press-panel p-6 shadow-2xl sm:p-8">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">Signed in</p>
            <h2 className="mt-3 text-2xl font-black">{email}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
                Named SerialPro jobs and QuotePro quotes save to this shop. Artwork PDFs stay in the browser and are
                never uploaded.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                    href="/tools/serialpro"
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-100 hover:border-cyan-300/40"
                >
                    Open SerialPro
                </Link>
                <Link
                    href="/tools/quotepro"
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-100 hover:border-cyan-300/40"
                >
                    Open QuotePro
                </Link>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-press/50 p-4">
                <p className="text-sm font-bold text-slate-100">Browser saves on this device</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                    {localCount === 0
                        ? "No local setups on this browser."
                        : `${localCount} local setup${localCount === 1 ? "" : "s"} on this browser. Copy them if you started work before signing in.`}
                </p>
                <button
                    type="button"
                    disabled={copying || localCount === 0}
                    className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={async () => {
                        setCopyError("");
                        setCopied("");
                        setCopying(true);
                        try {
                            const count = await copyLocalSavesToCloud(uid);
                            setCopied(
                                count === 0
                                    ? "Nothing new to copy."
                                    : `Copied ${count} setup${count === 1 ? "" : "s"} to your shop.`
                            );
                        } catch {
                            setCopyError("Could not copy browser saves. Check Firestore rules and try again.");
                        } finally {
                            setCopying(false);
                        }
                    }}
                >
                    {copying ? "Copying…" : "Copy browser saves to this shop"}
                </button>
                {copied && <p className="mt-3 text-sm text-emerald-300">{copied}</p>}
                {copyError && (
                    <p role="alert" className="mt-3 text-sm text-rose-300">
                        {copyError}
                    </p>
                )}
            </div>
            <button
                type="button"
                className="mt-6 text-sm font-semibold text-slate-400 underline-offset-4 hover:text-white hover:underline"
                onClick={onSignOut}
            >
                Sign out
            </button>
        </div>
    );
}

function ModeButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-3 py-1.5 ${
                active ? "bg-cyan-300 text-press" : "border border-white/10 text-slate-400 hover:text-white"
            }`}
        >
            {children}
        </button>
    );
}

function SignInForm({ onSubmit, onReset }: { onSubmit: (email: string, password: string) => Promise<void>; onReset: () => void }) {
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof credentialsSchema>>({ resolver: zodResolver(credentialsSchema) });

    return (
        <form
            className="mt-6"
            noValidate
            onSubmit={handleSubmit(async (values) => {
                setServerError("");
                try {
                    await onSubmit(values.email, values.password);
                } catch (error) {
                    setServerError(error instanceof Error ? error.message : "Could not sign in.");
                }
            })}
        >
            <Field label="Work email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" className={fieldClass} />
            </Field>
            <Field label="Password" error={errors.password?.message}>
                <input {...register("password")} type="password" autoComplete="current-password" className={fieldClass} />
            </Field>
            {serverError && (
                <p role="alert" className="mt-4 text-sm text-rose-300">
                    {serverError}
                </p>
            )}
            <button
                disabled={isSubmitting}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
            >
                {isSubmitting ? "Signing in…" : "Sign in"}
                <ArrowRight className="size-4" />
            </button>
            <button type="button" className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300" onClick={onReset}>
                Forgot password
            </button>
        </form>
    );
}

function SignUpForm({ onSubmit }: { onSubmit: (email: string, password: string) => Promise<void> }) {
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof signUpSchema>>({ resolver: zodResolver(signUpSchema) });

    return (
        <form
            className="mt-6"
            noValidate
            onSubmit={handleSubmit(async (values) => {
                setServerError("");
                try {
                    await onSubmit(values.email, values.password);
                } catch (error) {
                    setServerError(error instanceof Error ? error.message : "Could not create the account.");
                }
            })}
        >
            <Field label="Work email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" className={fieldClass} />
            </Field>
            <Field label="Password" error={errors.password?.message}>
                <input {...register("password")} type="password" autoComplete="new-password" className={fieldClass} />
            </Field>
            <Field label="Confirm password" error={errors.confirm?.message}>
                <input {...register("confirm")} type="password" autoComplete="new-password" className={fieldClass} />
            </Field>
            {serverError && (
                <p role="alert" className="mt-4 text-sm text-rose-300">
                    {serverError}
                </p>
            )}
            <button
                disabled={isSubmitting}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
            >
                {isSubmitting ? "Creating account…" : "Create shop account"}
                <ArrowRight className="size-4" />
            </button>
        </form>
    );
}

function ResetForm({
    onSubmit,
    onBack,
}: {
    onSubmit: (email: string) => Promise<void>;
    onBack: () => void;
}) {
    const [serverError, setServerError] = useState("");
    const [sent, setSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof resetSchema>>({ resolver: zodResolver(resetSchema) });

    if (sent) {
        return (
            <div className="mt-6 text-center">
                <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
                <h2 className="mt-5 text-2xl font-black">Check your email.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                    If an account exists for that address, we sent a password reset link.
                </p>
                <button type="button" className="mt-6 text-sm font-semibold text-cyan-300" onClick={onBack}>
                    Back to sign in
                </button>
            </div>
        );
    }

    return (
        <form
            className="mt-6"
            noValidate
            onSubmit={handleSubmit(async (values) => {
                setServerError("");
                try {
                    await onSubmit(values.email);
                    setSent(true);
                } catch (error) {
                    setServerError(error instanceof Error ? error.message : "Could not send a reset email.");
                }
            })}
        >
            <Field label="Work email" error={errors.email?.message}>
                <input {...register("email")} type="email" autoComplete="email" className={fieldClass} />
            </Field>
            {serverError && (
                <p role="alert" className="mt-4 text-sm text-rose-300">
                    {serverError}
                </p>
            )}
            <button
                disabled={isSubmitting}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
            >
                {isSubmitting ? "Sending…" : "Send reset link"}
                <ArrowRight className="size-4" />
            </button>
            <button type="button" className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-300" onClick={onBack}>
                Back to sign in
            </button>
        </form>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="mt-5 block first:mt-0">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
        </label>
    );
}

export function AccountPageCopy() {
    return (
        <section className="pt-6">
            <p className="kicker text-cyan-300">Shop account / optional</p>
            <h1 className="mt-6 text-5xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">
                Keep job setups with the shop, not just this browser.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
                Sign in to save SerialPro numbering setups and QuotePro quotes across computers. Artwork still never
                leaves the machine that generates it.
            </p>
            <div className="mt-10 grid gap-5 border-y border-white/10 py-7 sm:grid-cols-2">
                <div>
                    <HardDrive className="size-5 text-cyan-300" />
                    <h2 className="mt-4 text-sm font-black">No account needed to run jobs</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Tools stay usable immediately. Local saves remain the fallback when you are signed out.
                    </p>
                </div>
                <div>
                    <Cloud className="size-5 text-cyan-300" />
                    <h2 className="mt-4 text-sm font-black">Cloud stores settings only</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Prefixes, ranges, sheet layouts, and quote numbers. Not PDFs, not customer artwork.
                    </p>
                </div>
            </div>
            <p className="mt-8 text-sm text-slate-500">
                New to ProPrint?{" "}
                <Link href="/beta" className="font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline">
                    Apply for the founding beta
                </Link>
                .
            </p>
        </section>
    );
}
