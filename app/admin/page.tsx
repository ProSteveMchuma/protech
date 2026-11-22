import { isAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { contactClickSummary } from "@/lib/contact-clicks";
import { listPayments } from "@/lib/payments";
import { deskOrder, listPrintOrders } from "@/lib/print-orders";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const authed = await isAuthenticated();
    if (!authed) return <AdminLogin />;

    const [leads, payments, orders, clickSummary] = await Promise.all([
        listLeads(),
        listPayments(),
        listPrintOrders().then((items) => items.map(deskOrder)),
        contactClickSummary(30).catch(() => null),
    ]);
    return <AdminDashboard initialLeads={leads} initialPayments={payments} initialOrders={orders} clickSummary={clickSummary ?? emptySummary} />;
}

const emptySummary = { days: 30, total: 0, byChannel: { whatsapp: 0, call: 0 }, byPage: [], byDay: [] };
