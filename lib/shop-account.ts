export type ShopRole = "user" | "admin";

export type ShopAccount = {
  uid: string;
  email: string;
  phone?: string;
};

export function normalizeShopPhone(value: string | undefined): string | null {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return null;
}

export function accountRole(email: string | undefined, existing: string | undefined, staff: string[]): ShopRole {
  if (existing === "admin") return "admin";
  const normalized = (email || "").trim().toLowerCase();
  const allowed = new Set(staff.map((item) => item.trim().toLowerCase()).filter(Boolean));
  return normalized && allowed.has(normalized) ? "admin" : "user";
}

export function orderBelongsToAccount(
  order: { userId?: string; customer: { email: string; phone: string } },
  account: ShopAccount,
): boolean {
  if (order.userId && order.userId !== account.uid) return false;
  if (order.userId === account.uid) return true;
  const email = order.customer.email.trim().toLowerCase();
  if (email && email === account.email.trim().toLowerCase()) return true;
  const phone = normalizeShopPhone(order.customer.phone);
  const accountPhone = normalizeShopPhone(account.phone);
  return Boolean(phone && accountPhone && phone === accountPhone);
}

export function safeCallback(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}
