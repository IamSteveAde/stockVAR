import { apiFetchFirstSuccess } from "./client";
import { unwrapData, PaginationMeta, type ApiEnvelope } from "./response";

export type ShiftSnapshot = {
  sku: string;
  quantity: number;
};



export type ShiftRecord = {
  uid: string;
  name: string;
  staffCount: number;
  date: string;
  startTime: string;
  endTime: string;
  clockInTime?: string | null;
  clockOutTime?: string | null;
  status: string;
  staffResponsible: string;
  baseShiftUid: string;
};

export type CreateShiftPayload = {
  staffInChargeUid: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  name: string;
  linkedStaffUids: string[];
  repeatsOn?: string[];
  isWeekly?: boolean;
};

export type StartShiftPayload = {
  shiftUid: string;
  pin: string;
};

export type EndShiftPayload = {
  shiftUid: string;
  pin: string;
  products: {
    inventoryUid: string;
    count: number;
  }[];
};

export type ListShiftsResponse = {
  shifts: ShiftRecord[];
  meta: PaginationMeta;
};

export type LinkedStaffRecord = {
  uid: string;
  name: string;
};

export type ListLinkedStaffResponse = {
  linkedStaff: LinkedStaffRecord[];
  meta: PaginationMeta;
};

const SHIFT_PATHS = {
  create: ["api/shift/create"],
  list: ["api/shift/list"],
  start: ["/api/shift/start"],
  end: ["/api/shift/end"],
  linkedStaff: ["api/shift/linked-staff"],
};

export async function createShift(payload: CreateShiftPayload, token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<ShiftRecord> | ShiftRecord>(
    SHIFT_PATHS.create,
    {
      method: "POST",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}

export async function listShifts(token: string, page = 1, limit = 10, type?: string) {
  const paths = SHIFT_PATHS.list.map(p => `${p}?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<ListShiftsResponse> | ListShiftsResponse>(
    paths,
    { token }
  );
  return unwrapData(res);
}

export async function startShift(payload: StartShiftPayload, token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<ShiftRecord> | ShiftRecord>(
    SHIFT_PATHS.start,
    {
      method: "POST",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}

export async function endShift(payload: EndShiftPayload, token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<ShiftRecord> | ShiftRecord>(
    SHIFT_PATHS.end,
    {
      method: "POST",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}

export async function listLinkedStaff(shiftUid: string, page: number, token: string) {
  const paths = SHIFT_PATHS.linkedStaff.map((p) => `${p}?shiftUid=${shiftUid}&page=${page}`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<ListLinkedStaffResponse> | ListLinkedStaffResponse>(paths, { token });
  return unwrapData(res);
}
