/* ================= SUBSCRIPTION TYPES ================= */

export type SubscriptionStatus = "trial" | "active" | "expired";

/* ================= INVOICE ================= */

export type InvoiceStatus = "paid" | "pending" | "failed";

export type Invoice = {
  id: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
};

/* ================= SUBSCRIPTION ================= */

export type SubscriptionData = {
  status: SubscriptionStatus;

  /* Trial */
  trialStartedAt?: string;
  trialEndsAt?: string;

  /* Active */
  amount?: number;
  nextBillingAt?: string;

  /* Meta */
  createdAt: string;

  /* Billing */
  invoices: Invoice[];
};