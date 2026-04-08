import { apiFetchFirstSuccess } from "./client";
import { unwrapData, PaginationMeta, type ApiEnvelope } from "./response";

export type ShiftSnapshot = {
  sku: string;
  quantity: number;
};



export type ShiftRecord = {
  id: string;
  label: string;
  startDate: string;
  startTime: string;
  endTime: string;
  status: "planned" | "running" | "ended";
  responsibleStaffId: string;
  openingSnapshot?: ShiftSnapshot[];
  closingSnapshot?: ShiftSnapshot[];
  [key: string]: unknown;
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
  shiftId: string;
  pin: string;
  closingSnapshot: ShiftSnapshot[];
};

export type ListShiftsResponse = {
  shifts: ShiftRecord[];
  meta: PaginationMeta;
};

const SHIFT_PATHS = {
  create: ["api/shift/create"],
  list: ["api/shift/list"],
  start: ["/api/shift/start"],
  end: ["/api/shift/end"],
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

export async function listShifts(token: string, page = 1, limit = 10) {
  const paths = SHIFT_PATHS.list.map(p => `${p}?page=${page}&limit=${limit}`);
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
