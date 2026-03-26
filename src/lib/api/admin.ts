import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

export type AdminRestaurantRecord = {
id: string;
name: string;
city?: string;
owner?: string;
ownerEmail?: string;
phone?: string;
staffCount?: number;
subscriptionStatus?: string;
createdAt?: string;
lastActivity?: string;
[key: string]: unknown;
};

const ADMIN_PATHS = {
listRestaurants: ["api/admin/restaurants", "api/admin/list-restaurants"],
metrics: ["api/admin/metrics"],
users: ["api/admin/users"],
subscriptions: ["api/admin/subscriptions"],
};

export async function listAdminRestaurants(token: string) {
const res = await apiFetchFirstSuccess<
    ApiEnvelope<AdminRestaurantRecord[]> | AdminRestaurantRecord[]
>(ADMIN_PATHS.listRestaurants, { token });
return unwrapData(res);
}

export async function getAdminMetrics(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    ADMIN_PATHS.metrics,
    { token }
);
return unwrapData(res);
}

export async function getAdminUsers(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown[]> | unknown[]>(
    ADMIN_PATHS.users,
    { token }
);
return unwrapData(res);
}

export async function getAdminSubscriptions(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown[]> | unknown[]>(
    ADMIN_PATHS.subscriptions,
    { token }
);
return unwrapData(res);
}
