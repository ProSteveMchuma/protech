import { sendNotification } from "./email";
import { statusLabels } from "./order-desk";
import type { PrintOrder } from "./print-orders";

export async function notifyOrderStatus(order: PrintOrder) {
  const link = `https://www.proinnovationtech.co.ke/orders/${order.id}`;
  await sendNotification({
    to: order.customer.email,
    subject: `[ProPrint] Order ${order.id.slice(0, 8)} is ${order.status}`,
    html: `<p>Hello ${escapeHtml(order.customer.name)},</p><p>${escapeHtml(statusLabels[order.status])}</p><p>Total <strong>KES ${order.totalKes.toLocaleString("en-KE")}</strong>.</p><p>Track it here: <a href="${link}">${link}</a></p>`,
  });
}

function escapeHtml(input: string) {
  return input.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}
