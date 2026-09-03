"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Briefcase,
    Users,
    LogOut,
    RefreshCw,
    Mail,
    Search,
    CreditCard,
    CheckCircle2,
    XCircle,
    Banknote,
    Clock,
} from "lucide-react";
import type { Lead } from "@/lib/leads";
import type { Payment, PaymentStatus } from "@/lib/payments";
import { Logo } from "./Logo";

interface Props {
    initialLeads: Lead[];
    initialPayments: Payment[];
}

const LEAD_COLOURS: Record<Lead["status"], string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-800",
    converted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-slate-200 text-slate-600",
};

const PAY_COLOURS: Record<PaymentStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    verified: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
};

type Tab = "payments" | "leads";

export function AdminDashboard({ initialLeads, initialPayments }: Props) {
    const [tab, setTab] = useState<Tab>(
        initialPayments.some((p) => p.status === "pending") ? "payments" : "leads"
    );
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [payments, setPayments] = useState<Payment[]>(initialPayments);
    const [filter, setFilter] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const stats = useMemo(() => {
        const pending = payments.filter((p) => p.status === "pending").length;
        const verifiedTotal = payments
            .filter((p) => p.status === "verified")
            .reduce((sum, p) => sum + p.amount, 0);
        const newLeads = leads.filter((l) => l.status === "new").length;
        const conv = leads.filter((l) => l.status === "converted").length;
        return {
            pending,
            verifiedTotal,
            totalLeads: leads.length,
            newLeads,
            conv,
        };
    }, [leads, payments]);

    async function refresh() {
        setRefreshing(true);
        try {
            const [leadsRes, paysRes] = await Promise.all([
                fetch("/api/admin/leads"),
                fetch("/api/admin/payments"),
            ]);
            const leadsBody = await leadsRes.json();
            const paysBody = await paysRes.json();
            if (leadsBody.success) setLeads(leadsBody.leads);
            if (paysBody.success) setPayments(paysBody.payments);
        } finally {
            setRefreshing(false);
        }
    }

    async function setLeadStatus(id: string, status: Lead["status"]) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        await fetch("/api/admin/leads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    async function setPaymentStatus(id: string, status: PaymentStatus) {
        setPayments((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        await fetch("/api/admin/payments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    async function logout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-press text-white h-16 flex items-center px-6 justify-between">
                <div className="flex items-center gap-3">
                    <Logo variant="mark" size={32} />
                    <span className="text-lg font-black">ProPrint Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={refresh}
                        disabled={refreshing}
                        className="text-sm flex items-center gap-2 opacity-80 hover:opacity-100"
                    >
                        <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={logout}
                        className="text-sm flex items-center gap-2 opacity-80 hover:opacity-100"
                    >
                        <LogOut className="size-4" /> Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        icon={<Clock className="size-5 text-amber-600" />}
                        label="Payments to verify"
                        value={stats.pending}
                        accent={stats.pending > 0}
                    />
                    <StatCard
                        icon={<Banknote className="size-5 text-emerald-600" />}
                        label="Verified revenue"
                        value={`KES ${stats.verifiedTotal.toLocaleString()}`}
                    />
                    <StatCard
                        icon={<Mail className="size-5 text-blue-600" />}
                        label="New leads"
                        value={stats.newLeads}
                    />
                    <StatCard
                        icon={<Users className="size-5 text-slate-600" />}
                        label="Conversion"
                        value={
                            stats.totalLeads === 0
                                ? "—"
                                : `${Math.round((stats.conv / stats.totalLeads) * 100)}%`
                        }
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-200">
                    <TabButton active={tab === "payments"} onClick={() => setTab("payments")}>
                        <CreditCard className="size-4" /> Payments
                        {stats.pending > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                                {stats.pending}
                            </span>
                        )}
                    </TabButton>
                    <TabButton active={tab === "leads"} onClick={() => setTab("leads")}>
                        <Briefcase className="size-4" /> Leads
                    </TabButton>
                </div>

                {/* Filter */}
                <div className="mb-4 relative max-w-md">
                    <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={
                            tab === "payments"
                                ? "Search by name, email, M-Pesa code..."
                                : "Search leads..."
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {tab === "payments" ? (
                    <PaymentsTable
                        payments={payments}
                        filter={filter}
                        onSetStatus={setPaymentStatus}
                    />
                ) : (
                    <LeadsTable leads={leads} filter={filter} onSetStatus={setLeadStatus} />
                )}
            </div>
        </div>
    );
}

function PaymentsTable({
    payments,
    filter,
    onSetStatus,
}: {
    payments: Payment[];
    filter: string;
    onSetStatus: (id: string, s: PaymentStatus) => void;
}) {
    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        const sorted = [...payments].sort((a, b) => {
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;
            return b.createdAt.localeCompare(a.createdAt);
        });
        if (!q) return sorted;
        return sorted.filter((p) =>
            JSON.stringify(p).toLowerCase().includes(q)
        );
    }, [payments, filter]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {filtered.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                    <p className="font-semibold mb-1">No payments yet.</p>
                    <p className="text-sm">
                        Payment submissions from /checkout will appear here for verification.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">M-Pesa code</th>
                                <th className="px-4 py-3 font-medium">Account ref / Customer</th>
                                <th className="px-4 py-3 font-medium">Package</th>
                                <th className="px-4 py-3 font-medium text-right">Amount</th>
                                <th className="px-4 py-3 font-medium">Submitted</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-slate-100 align-top hover:bg-slate-50/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-mono font-bold text-slate-900">
                                            {p.mpesaCode}
                                        </div>
                                        <span
                                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PAY_COLOURS[p.status]}`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-900">{p.accountRef}</div>
                                        <a
                                            href={`mailto:${p.customerEmail}`}
                                            className="text-xs text-blue-600 hover:underline block"
                                        >
                                            {p.customerEmail}
                                        </a>
                                        <span className="text-xs text-slate-500">{p.customerPhone}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-slate-900 text-sm">{p.tier}</div>
                                        <div className="text-xs text-slate-500">{p.service}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="font-bold text-slate-900">
                                            KES {p.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(p.createdAt).toLocaleString("en-KE", {
                                            timeZone: "Africa/Nairobi",
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.status === "pending" ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onSetStatus(p.id, "verified")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                                                    title="Mark as paid"
                                                >
                                                    <CheckCircle2 className="size-3.5" /> Verify
                                                </button>
                                                <button
                                                    onClick={() => onSetStatus(p.id, "rejected")}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200"
                                                    title="Code did not match a real payment"
                                                >
                                                    <XCircle className="size-3.5" /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onSetStatus(p.id, "pending")}
                                                className="text-xs text-slate-500 hover:text-slate-900 underline"
                                            >
                                                Reopen
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function LeadsTable({
    leads,
    filter,
    onSetStatus,
}: {
    leads: Lead[];
    filter: string;
    onSetStatus: (id: string, s: Lead["status"]) => void;
}) {
    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return leads;
        return leads.filter((l) => JSON.stringify(l).toLowerCase().includes(q));
    }, [leads, filter]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {filtered.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                    <p className="font-semibold mb-1">No leads yet.</p>
                    <p className="text-sm">Beta applications and product feedback will show up here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Contact</th>
                                <th className="px-4 py-3 font-medium">Details</th>
                                <th className="px-4 py-3 font-medium">Received</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((l) => {
                                const d = l.data as Record<string, unknown>;
                                const summary =
                                    (d.primaryNeed as string) ||
                                    [d.product, d.experience, d.message]
                                        .filter((value): value is string => typeof value === "string" && value.length > 0)
                                        .join(" · ") ||
                                    "";
                                return (
                                    <tr key={l.id} className="border-t border-slate-100 align-top">
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                                {l.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-slate-900">
                                                    {(d.fullName as string) || "—"}
                                                </span>
                                            </div>
                                            <a
                                                href={`mailto:${d.email as string}`}
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                {d.email as string}
                                            </a>
                                            {d.companyName ? (
                                                <div className="text-xs text-slate-500">
                                                    {d.companyName as string}
                                                </div>
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 max-w-md">
                                            <div className="line-clamp-2 text-xs">
                                                {summary || "—"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                            {new Date(l.createdAt).toLocaleString("en-KE", {
                                                timeZone: "Africa/Nairobi",
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={l.status}
                                                onChange={(e) =>
                                                    onSetStatus(l.id, e.target.value as Lead["status"])
                                                }
                                                className={`px-2 py-1 rounded-full text-xs font-bold border-none outline-none ${LEAD_COLOURS[l.status]}`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="converted">Converted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function TabButton({
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
            onClick={onClick}
            className={`px-4 py-3 -mb-px border-b-2 text-sm font-semibold flex items-center gap-2 transition ${active
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
        >
            {children}
        </button>
    );
}

function StatCard({
    icon,
    label,
    value,
    accent = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    accent?: boolean;
}) {
    return (
        <div
            className={`p-5 rounded-2xl border shadow-sm ${accent
                ? "bg-amber-50 border-amber-200"
                : "bg-white border-slate-100"
                }`}
        >
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                {icon}
                {label}
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}
