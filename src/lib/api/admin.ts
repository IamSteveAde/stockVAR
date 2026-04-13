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
    listRestaurants: ["api/admin/businesses"],
    metrics: ["api/admin/metrics"],
    overview: "api/admin/overview", // Added overview root
    users: ["api/admin/users"],
    usersMetrics: ["api/admin/users/metrics"],
    subscriptionsList: ["api/admin/subscriptions/list"],
    subscriptionsMetrics: ["api/admin/subscriptions/metrics"],
};

export async function getAdminOverviewMetric(token: string, type: string) {
    const res = await apiFetchFirstSuccess<ApiEnvelope<{type: string; count: number}> | {type: string; count: number}>(
        [`${ADMIN_PATHS.overview}/${type}`],
        { token }
    );
    return unwrapData(res);
}

export async function getAdminUserMetric(token: string, type: string) {
    const paths = ADMIN_PATHS.usersMetrics.map(p => `${p}?type=${type}`);
    const res = await apiFetchFirstSuccess<ApiEnvelope<{type: string; count: number}> | {type: string; count: number}>(
        paths,
        { token }
    );
    return unwrapData(res);
}

export async function listAdminRestaurants(token: string, page = 1) {
    const res = await apiFetchFirstSuccess<
        ApiEnvelope<{ meta: any; businesses: any[] }> | { meta: any; businesses: any[] }
    >(ADMIN_PATHS.listRestaurants.map(p => `${p}?page=${page}`), { token });
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

export async function listAdminSubscriptions(token: string, page = 1) {
    const res = await apiFetchFirstSuccess<
        ApiEnvelope<{ meta: any; businesses: any[] }> | { meta: any; businesses: any[] }
    >(ADMIN_PATHS.subscriptionsList.map(p => `${p}?page=${page}`), { token });
    return unwrapData(res);
}

export async function getAdminSubscriptionMetric(token: string, type: string) {
    const paths = ADMIN_PATHS.subscriptionsMetrics.map(p => `${p}?type=${type}`);
    const res = await apiFetchFirstSuccess<ApiEnvelope<{type: string; count: number}> | {type: string; count: number}>(
        paths,
        { token }
    );
    return unwrapData(res);
}
