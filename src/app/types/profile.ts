import type { UserRole } from "@/types/auth";

export type { UserRole };
export type UserStatus = "active" | "suspended";
export type ProfileData = {
  // id: string;                 // ✅ ADD THIS
  fullName: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
  profileUrl: string;
  status: string;
  lastPasswordChange?: string;
};
