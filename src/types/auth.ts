export type UserRole = "owner" | "manager" | "staff" | "admin";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type BaseResponse = {
  status: string,
  data?: Record<any, any> | Record<any, any>[]
  message?: string
}