export type DeskStatus = "received" | "confirmed" | "printing" | "dispatched" | "cancelled";

export const statusLabels: Record<DeskStatus, string> = {
  received: "Received. We are matching the M-Pesa code.",
  confirmed: "Payment confirmed. The job is in the queue.",
  printing: "Printing in Nairobi.",
  dispatched: "Dispatched for delivery.",
  cancelled: "Cancelled. We will contact you about the payment.",
};

export function statusAfterPayment(status: DeskStatus, decision: "confirmed" | "rejected"): DeskStatus {
  if (decision === "confirmed" && status === "received") return "confirmed";
  return status;
}

const extensions = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

export const MAX_ARTWORK_BYTES = 15 * 1024 * 1024;

export function artworkExtension(contentType: string) {
  return extensions.get(contentType) ?? null;
}

export function artworkContentType(name: string, type: string) {
  if (artworkExtension(type)) return type;
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "application/pdf";
  if (extension === "png") return "image/png";
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "webp") return "image/webp";
  return type;
}

const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginBlocked(key: string, now = Date.now()) {
  const current = attempts.get(key);
  return Boolean(current && current.resetAt > now && current.count >= 8);
}

export function recordLoginFailure(key: string, now = Date.now()) {
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return;
  }
  current.count += 1;
}

export function resetLoginAttempts() {
  attempts.clear();
}
