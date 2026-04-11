import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";
import type { ListShiftsResponse } from "./shifts";

const DASHBOARD_PATHS = {
staffMetrics: ["api/dashboard/staff/metric"],
staffUpcomingShift: [
    "api/dashboard/staff/recent-upcoming-shift",
    "api/dashboard/staff/recentUpcomingShift",
],
managerOwnerMetrics: [
    "/api/dashboard/base/metric"
],
managerOwnerVarSummary: [
    "/api/dashboard/base/var-summary"
],
};

export type StaffMetricType = "all" | "completed" | "responsible";

export type StaffMetricResponse = {
  type: StaffMetricType;
  count: number;
};

export async function getStaffDashboardMetrics(token: string, type: StaffMetricType = "all") {
const paths = DASHBOARD_PATHS.staffMetrics.map(p => `${p}?type=${type}`);
const res = await apiFetchFirstSuccess<ApiEnvelope<StaffMetricResponse> | StaffMetricResponse>(
    paths,
    { token }
);
return unwrapData(res);
}

export async function getStaffShiftsByType(token: string, type: "recent" | "upcoming", page = 1) {
  // Pass timezone parameter as explicitly required by API spec
  const timezone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London");
  const res = await apiFetchFirstSuccess<ApiEnvelope<ListShiftsResponse> | ListShiftsResponse>(
    [`api/shift/list/${type}?page=${page}&timezone=${timezone}`],
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

export type VarSummaryItem = {
  name: string;
  unit: string;
  expectedCount: number;
  actualCount: number;
  variance: number;
};

export type VarSummaryResponse = {
  data: VarSummaryItem[];
  meta: any;
};

export async function getManagerOwnerVarSummary(token: string) {
const res = await apiFetchFirstSuccess<ApiEnvelope<VarSummaryResponse> | VarSummaryResponse>(
    DASHBOARD_PATHS.managerOwnerVarSummary,
    { token }
);
return unwrapData(res);
}
