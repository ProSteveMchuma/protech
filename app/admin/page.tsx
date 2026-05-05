import { isAuthenticated } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { listPayments } from "@/lib/payments";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const authed = await isAuthenticated();
    if (!authed) return <AdminLogin />;

    const [leads, payments] = await Promise.all([listLeads(), listPayments()]);
    return <AdminDashboard initialLeads={leads} initialPayments={payments} />;
}
