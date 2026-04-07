import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

type BackendBusinessProfile = {
  id?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  name?: string;
  businessType?: string;
  type?: string;
  location?: string;
  city?: string;
  dailyStaffSize?: string;
  staffSize?: string;
  timezone?: string;
  createdAt?: string;
};

export type BusinessProfile = {
  id: string;
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  name: string;
  type: string;
  city: string;
  staffSize?: string;
  timezone: string;
  createdAt: string;
};

export type CreateBusinessPayload = {
  name: string;
  type?: string;
  businessType?: string;
  city?: string;
  location?: string;
  staffSize?: string;
  dailyStaffSize?: string;
  timezone?: string;
};

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;

const BUSINESS_PATHS = {
  me: ["api/profile/me/business"],
  create: ["api/profile/me/business"],
  update: ["api/profile/me/business"],
};

function toBackendPayload(payload: CreateBusinessPayload | UpdateBusinessPayload) {
  return {
    name: payload.name,
    businessType: payload.businessType ?? payload.type,
    location: payload.location ?? payload.city,
    dailyStaffSize: payload.dailyStaffSize ?? payload.staffSize,
  };
}

function normalizeBusinessProfile(
  payload: unknown,
  fallback?: CreateBusinessPayload | UpdateBusinessPayload
): BusinessProfile | null {
  if (!payload || typeof payload !== "object") return null;

  const value = payload as BackendBusinessProfile;
  const name = value.name ?? fallback?.name ?? "";
  const type = value.type ?? value.businessType ?? fallback?.type ?? fallback?.businessType ?? "";
  const city = value.city ?? value.location ?? fallback?.city ?? fallback?.location ?? "";

  if (!name || !type || !city) {
    return null;
  }

  return {
    id: value.id ?? `local-${Date.now()}`,
    userId: value.userId,
    fullName: value.fullName,
    email: value.email,
    phone: value.phone,
    name,
    type,
    city,
    staffSize: value.staffSize ?? value.dailyStaffSize ?? fallback?.staffSize ?? fallback?.dailyStaffSize,
    timezone: value.timezone ?? fallback?.timezone ?? "Africa/Lagos",
    createdAt: value.createdAt ?? new Date().toISOString(),
  };
}

function fallbackBusinessProfile(payload: CreateBusinessPayload | UpdateBusinessPayload): BusinessProfile {
  return {
    id: `local-${Date.now()}`,
    name: payload.name ?? "",
    type: payload.businessType ?? payload.type ?? "",
    city: payload.location ?? payload.city ?? "",
    staffSize: payload.dailyStaffSize ?? payload.staffSize,
    timezone: payload.timezone ?? "Africa/Lagos",
    createdAt: new Date().toISOString(),
  };
}

export async function getMyBusinessProfile(token: string) {
  try {
    const res = await apiFetchFirstSuccess<ApiEnvelope<BackendBusinessProfile> | BackendBusinessProfile>(
      BUSINESS_PATHS.me,
      { token }
    );
    const data = unwrapData(res);
    return normalizeBusinessProfile(data);
  } catch {
    // Business profile doesn't exist yet (not onboarded)
    return null;
  }
}

export async function createBusinessProfile(
  payload: CreateBusinessPayload,
  token: string
) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<BackendBusinessProfile> | BackendBusinessProfile>(
    BUSINESS_PATHS.create,
    {
      method: "POST",
      body: toBackendPayload(payload),
      token,
    }
  );
  const data = unwrapData(res);
  return normalizeBusinessProfile(data, payload) ?? fallbackBusinessProfile(payload);
}

export async function updateBusinessProfile(
  payload: UpdateBusinessPayload,
  token: string
) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<BackendBusinessProfile> | BackendBusinessProfile>(
    BUSINESS_PATHS.update,
    {
      method: "PUT",
      body: toBackendPayload(payload),
      token,
    }
  );
  const data = unwrapData(res);
  return normalizeBusinessProfile(data, payload) ?? fallbackBusinessProfile(payload);
}
