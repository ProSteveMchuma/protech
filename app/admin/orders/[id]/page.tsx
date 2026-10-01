import { notFound } from "next/navigation";
import { OrderDesk } from "@/components/admin/OrderDesk";
import { AdminLogin } from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/auth";
import { deskOrder, getPrintOrder } from "@/lib/print-orders";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return <AdminLogin />;
  const { id } = await params;
  const order = await getPrintOrder(id);
  if (!order) notFound();
  return <OrderDesk initialOrder={deskOrder(order)} />;
}
