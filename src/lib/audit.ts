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

export function writeAuditLog(
  log: Omit<AuditLog, "id" | "createdAt">
) {
  const existing: AuditLog[] = (() => {
    try {
      const raw = localStorage.getItem(AUDIT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const entry: AuditLog = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  existing.unshift(entry);

  localStorage.setItem(
    AUDIT_KEY,
    JSON.stringify(existing)
  );
}
