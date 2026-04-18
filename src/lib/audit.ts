import type { UserRole } from "@/types/auth";

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
    role: UserRole;
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

export function normalizeAuditLog(raw: any): AuditLog | null {
  if (!raw || typeof raw !== "object") return null;

  const action = raw.action;
  const description = raw.detail || raw.description || raw.action;
  const createdAt = raw.createdAt;
  const actor = raw.staff || raw.actor;

  if (!action || typeof action !== "string") return null;
  if (!createdAt || typeof createdAt !== "string") return null;
  if (!actor || typeof actor !== "object") return null;

  return {
    id: raw.id || crypto.randomUUID(),
    action: action as any,
    description: description || "",
    createdAt,
    actor: {
      staffId: actor.staffId || "unknown",
      name: actor.name || "Unknown",
      role: actor.role?.toLowerCase() || "staff",
    },
    entity: {
      type: (raw.entity?.toLowerCase() as any) || "system",
      name: raw.product && raw.product !== "N/A" ? raw.product : undefined,
    },
    shift: raw.shift && raw.shift !== "N/A" ? { id: "unknown", label: raw.shift } : undefined,
  };
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
