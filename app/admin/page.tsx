import { isAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { listPayments } from "@/lib/payments";
import { deskOrder, listPrintOrders } from "@/lib/print-orders";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const authed = await isAuthenticated();
    if (!authed) return <AdminLogin />;

    const [leads, payments, orders] = await Promise.all([listLeads(), listPayments(), listPrintOrders().then((items) => items.map(deskOrder))]);
    return <AdminDashboard initialLeads={leads} initialPayments={payments} initialOrders={orders} />;
}
