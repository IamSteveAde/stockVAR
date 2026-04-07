import { BaseResponse } from "@/types/auth";
import { ApiError, apiFetch, apiFetchFirstSuccess } from "./client";
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
  location: string;
  staffSize?: string;
  timezone: string;
  createdAt: string;
};

export type CreateBusinessPayload = {
  name: string;
  businessType: string;
  location: string;
  dailyStaffSize?: string;
  timezone?: string;
};

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;

const BUSINESS_PATHS = {
  me: ["api/profile/me"],
  create: ["api/business/profile/create"],
  update: ["api/profile/me/business"],
};

function toBackendPayload(payload: CreateBusinessPayload | UpdateBusinessPayload) {
  return {
    name: payload.name,
    businessType: payload.businessType ?? payload.businessType,
    location: payload.location ,
    dailyStaffSize: payload.dailyStaffSize ,
  };
}

function normalizeBusinessProfile(
  payload: unknown,
  fallback?: CreateBusinessPayload | UpdateBusinessPayload
): BusinessProfile | null {
  if (!payload || typeof payload !== "object") return null;

  const value = payload as BackendBusinessProfile;
  const name = value.name ?? fallback?.name ?? "";
  const type = value.businessType;
  const location = value.location;

  if (!name || !type || !location) {
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
    location,
    staffSize: value.dailyStaffSize ,
    timezone: value.timezone ?? fallback?.timezone ?? "Africa/Lagos",
    createdAt: value.createdAt ?? new Date().toISOString(),
  };
}

function fallbackBusinessProfile(payload: CreateBusinessPayload | UpdateBusinessPayload): BusinessProfile {
  return {
    id: `local-${Date.now()}`,
    name: payload.name ?? "",
    type: payload.businessType ?? payload.businessType ?? "",
    location: payload.location ?? payload.location ?? "",
    staffSize: payload.dailyStaffSize,
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

    // const res = await apiFetch(BUSINESS_PATHS.me, { token })
    return unwrapData(res);
  } catch {
    // Business profile doesn't exist yet (not onboarded)
    return null;
  }
}

export async function createBusinessProfile(
  payload: CreateBusinessPayload,
  token: string
) {

  console.log("payload ===> ", payload)

  // const res = await apiFetchFirstSuccess<ApiEnvelope<BusinessProfile> | BusinessProfile>(
  //   BUSINESS_PATHS.create,
  //   {
  //     method: "POST",
  //     body: payload,
  //     token,
  //   }
  // );

  const res = await apiFetch<BaseResponse>(BUSINESS_PATHS.create[0], {
    method: "POST",
    body: payload,
    token,
  });
  
  if (res.status && res.status !== "success") {
    throw new Error(res.message || "Failed to create business profile.");
  }

  return unwrapData(res);

  // console.log("res====>", res)

  // if (res.status && res.status !== "success") {
  //   throw new Error(res.message || "Failed to create business profile.");
  // }

  // // console.log("data ===>", unwrapData(res))

  // return unwrapData(res);
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
