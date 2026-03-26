import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type StaffRole = "owner" | "manager" | "staff";
export type StaffStatus = "active" | "invited" | "archived";

export type StaffRecord = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  pin?: string;
  [key: string]: unknown;
};

export type CreateStaffPayload = {
  fullName: string;
  email: string;
  phone?: string;
  role: StaffRole;
};

const STAFF_PATHS = {
  list: ["api/staff/list", "api/staff/list-staff", "api/staff/listStaff"],
  create: ["api/staff/create"],
};

export async function listStaff(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<StaffRecord[]> | StaffRecord[]>(
    STAFF_PATHS.list,
    { token }
  );
  return unwrapData(res);
}

export async function createStaff(payload: CreateStaffPayload, token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<StaffRecord> | StaffRecord>(
    STAFF_PATHS.create,
    {
      method: "POST",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}
