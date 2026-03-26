import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

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
  label: string;
  startDate: string;
  startTime: string;
  endTime: string;
  responsibleStaffId: string;
  staffIds: string[];
  recurrence?: {
    enabled: boolean;
    daysOfWeek: number[];
    until?: string;
  };
};

export type StartShiftPayload = {
  shiftId: string;
  pin: string;
  openingSnapshot?: ShiftSnapshot[];
};

export type EndShiftPayload = {
  shiftId: string;
  pin: string;
  closingSnapshot: ShiftSnapshot[];
};

const SHIFT_PATHS = {
  create: ["api/shifts/create-shift", "api/shifts/createShift"],
  list: ["api/shifts/list", "api/shifts/list-shifts", "api/shifts/listShifts"],
  start: ["api/shifts/start-shift", "api/shifts/startShift"],
  end: ["api/shifts/end-shift", "api/shifts/endShift"],
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

export async function listShifts(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<ShiftRecord[]> | ShiftRecord[]>(
    SHIFT_PATHS.list,
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
