import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type BusinessProfile = {
  id: string;
  userId: string;
  name: string;
  type: string;
  city: string;
  staffSize?: string;
  timezone: string;
  createdAt: string;
};

export type CreateBusinessPayload = {
  name: string;
  type: string;
  city: string;
  staffSize?: string;
  timezone: string;
};

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;

const BUSINESS_PATHS = {
  me: ["api/profile/me/business"],
  create: ["api/profile/me/business"],
  update: ["api/profile/me/business"],
};

export async function getMyBusinessProfile(token: string) {
  try {
    const res = await apiFetchFirstSuccess<ApiEnvelope<BusinessProfile> | BusinessProfile>(
      BUSINESS_PATHS.me,
      { token }
    );
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
  const res = await apiFetchFirstSuccess<ApiEnvelope<BusinessProfile> | BusinessProfile>(
    BUSINESS_PATHS.create,
    {
      method: "POST",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}

export async function updateBusinessProfile(
  payload: UpdateBusinessPayload,
  token: string
) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<BusinessProfile> | BusinessProfile>(
    BUSINESS_PATHS.update,
    {
      method: "PUT",
      body: payload,
      token,
    }
  );
  return unwrapData(res);
}
