export type ProfileData = {
  fullName: string;
  phone: string;
  email: string;
  role: "Owner" | "Manager" | "Staff";
  avatar: string;
  status: "active" | "suspended";
};
