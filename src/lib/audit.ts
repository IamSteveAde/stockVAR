/* ================= AUDIT TYPES ================= */

export type AuditAction =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "SHIFT_CREATE"
  | "SHIFT_START"
  | "SHIFT_END"
  | "SHIFT_DELETE"
  | "STAFF_CREATE"
  | "STAFF_ARCHIVE"
  | "STAFF_DELETE"
  | "PRODUCT_CREATE"
  | "PRODUCT_EDIT"
  | "PRODUCT_ARCHIVE"
  | "INVENTORY_ADJUST"
  | "LOGIN"
  | "LOGOUT";

export type AuditLog = {
  id: string;

  /* WHO */
  actor: {
    staffId: string;
    name: string;
    role: "owner" | "manager" | "staff";
  };

  /* WHAT */
  action: AuditAction;
  description: string;

  /* ENTITY AFFECTED */
  entity: {
    type: "product" | "shift" | "staff" | "inventory" | "system";
    id?: string;
    name?: string;
  };

  /* BEFORE / AFTER */
  changes?: {
    before?: any;
    after?: any;
    delta?: any;
  };

  /* SHIFT CONTEXT */
  shift?: {
    id: string;
    label: string;
  };

  /* TIME */
  createdAt: string;
};

/* ================= STORAGE ================= */

export const AUDIT_KEY = "stockvar_audit_logs";
/* ================= HELPERS ================= */

export function readAuditLogs(): AuditLog[] {
  return []; // Fall back removed
}

export function writeAuditLog(
  log: Omit<AuditLog, "id" | "createdAt">
) {
  // localStorage fallback completely removed in favor of strict backend boundaries

  const entry: AuditLog = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("audit:updated", {
        detail: entry,
      })
    );
  }
}
