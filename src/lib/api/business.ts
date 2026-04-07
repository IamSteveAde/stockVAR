import { BaseResponse } from "@/types/auth";
import { ApiError, apiFetch, apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type BusinessProfile = {
  id: string;
  userId: string;
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

export async function getMyBusinessProfile(token: string) {
  try {
    const res = await apiFetchFirstSuccess<ApiEnvelope<BusinessProfile> | BusinessProfile>(
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
