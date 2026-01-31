import { UserRole } from "@/types/auth";

export type NavItemKey =
  | "dashboard"
  | "stock"
  | "new-entry"
  | "staff"
  | "shifts"
  | "reports"
  | "account"
  | "profile"
  | "help";

export const NAVIGATION: Record<UserRole, NavItemKey[]> = {
  owner: [
    "dashboard",
    "stock",
    "new-entry",
    "staff",
    "shifts",
    "reports",
    "account",
    "profile",
    "help",
  ],

  manager: [
    "dashboard",
    "stock",
    "new-entry",
    "staff",
    "shifts",
    "reports",
    "profile",
    "help",
  ],

  staff: [
    "shifts",
    "new-entry",
    "profile",
  ],
};