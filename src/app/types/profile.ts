export type UserRole = "owner" | "manager" | "staff";
export type UserStatus = "active" | "suspended";
export type ProfileData = {
  id: string;                 // ✅ ADD THIS
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: "active" | "suspended";
};
