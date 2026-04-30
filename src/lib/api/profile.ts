import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";
import type { ProfileData } from "@/app/types/profile";

// export type CreateProfilePayload = {
//     fullName: string;
//     email: string;
//     phone: string;
//     role?: "owner" | "manager" | "staff";
//     avatar?: string;
// };

export type UpdateProfilePayload = {
    name?: string;
    phoneNo?: string;
    [key: string]: any;
};

const PROFILE_PATHS = {
    me: ["api/profile/me"],
    updateMe: ["api/profile/me"],
    // createProfile: ["api/profile/create-profile", "api/profile/createProfile"],
    auditTrail: ["api/audit-trail/list"],
};

export async function getMyProfile(token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<ProfileData> | ProfileData>(
        PROFILE_PATHS.me,
        { token }
    );
    return unwrapData(res);
}

export async function updateMyProfile(payload: UpdateProfilePayload, token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<ProfileData> | ProfileData>(
        PROFILE_PATHS.updateMe,
        {
            method: "PUT",
            body: payload,
            token,
        }
    );
    return unwrapData(res);
}

// export async function createProfile(payload: CreateProfilePayload, token: string) {
//     const res = await apiFetchFirstSuccess<ApiEnvelope<ProfileData> | ProfileData>(
//         PROFILE_PATHS.createProfile,
//         {
//             method: "POST",
//             body: payload,
//             token,
//         }
//     );
//     return unwrapData(res);
// }

export async function getProfileAuditTrail(token: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<any> | any>(
        PROFILE_PATHS.auditTrail,
        { token }
    );
    return unwrapData(res);
}
