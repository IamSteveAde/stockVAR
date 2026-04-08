import { apiFetchFirstSuccess } from "./client";
import { unwrapData, PaginationMeta, type ApiEnvelope } from "./response";

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
  uid?: string;
  name?: string;
  [key: string]: unknown;
};



export type ListStaffResponse = {
  staff: StaffRecord[];
  meta: PaginationMeta;
};

export type CreateStaffPayload = {
  name: string;
  email: string;
  phoneNo: string;
  role: string;
};

const STAFF_PATHS = {
  list: ["api/staff/list"],
  create: ["api/staff/create"],
};

export async function listStaff(token: string, page = 1, limit = 1) {
  const paths = STAFF_PATHS.list.map(p => `${p}?page=${page}&limit=${limit}`);
  // const paths = STAFF_PATHS.list.map(p => `${p}?page=${page}&limit=1`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<ListStaffResponse> | ListStaffResponse>(
    paths,
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
