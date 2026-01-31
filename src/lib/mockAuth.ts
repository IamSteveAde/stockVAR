import { AuthUser } from "@/types/auth";

/**
 * 🔴 TEMPORARY MOCK
 * Replace later with real auth
 */
export const getCurrentUser = (): AuthUser => {
  return {
    id: "1",
    fullName: "Ade Founder",
    email: "ade@stockvar.com",

    // 🔁 CHANGE THIS TO TEST UI
    // "owner" | "manager" | "staff"
    role: "staff",
  };
};