export type UserRole = "owner" | "manager" | "staff";

export const ROLE_NAV_ACCESS: Record<UserRole, string[]> = {
  owner: [
    "dashboard",
    "stock",
    "entry",
    "staff",
    "shift",
    "reports",
    "profile",
    "account",
    "help",
  ],

  manager: [
    "dashboard",
    "stock",
    "entry",
    "staff",
    "shift",
    "reports",
    "profile",
    "help",
  ],

  staff: [
    "shift",
    "entry",
    "profile",
  ],
};