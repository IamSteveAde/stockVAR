import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

const DASHBOARD_PATHS = {
staffMetrics: ["api/dashboard/staff/metrics"],
staffUpcomingShift: [
    "api/dashboard/staff/recent-upcoming-shift",
    "api/dashboard/staff/recentUpcomingShift",
],
managerOwnerMetrics: [
    "/api/dashboard/base/metric"
],
managerOwnerVarSummary: [
    "api/dashboard/manager-owner/var-summary",
    "api/dashboard/manager-owner/varSummary",
],
};

export async function getStaffDashboardMetrics(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    DASHBOARD_PATHS.staffMetrics,
    { token }
);
return unwrapData(res);
}

export async function getStaffRecentUpcomingShift(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    DASHBOARD_PATHS.staffUpcomingShift,
    { token }
);
return unwrapData(res);
}

export type DashboardMetricsData = {
  stockCount: number;
  unresolvedVar: number;
  staff: number;
};

export async function getManagerOwnerDashboardMetrics(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<DashboardMetricsData> | DashboardMetricsData>(
    DASHBOARD_PATHS.managerOwnerMetrics,
    { token }
);
return unwrapData(res);
}

export async function getManagerOwnerVarSummary(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    DASHBOARD_PATHS.managerOwnerVarSummary,
    { token }
);
return unwrapData(res);
}
