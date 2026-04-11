import { apiFetchFirstSuccess } from "./client";
import { unwrapData, PaginationMeta, type ApiEnvelope } from "./response";

export type ReportRow = {
  name: string;
  unit: string;
  expectedCount: number;
  actualCount: number;
  variance: number;
};

export interface OverviewReportResponse {
  data: ReportRow[];
  meta: PaginationMeta;
}

export interface VarianceAlertRow {
  date: string;
  name: string;
  unit: string;
  variance: number;
  shift: string;
  shiftId: string;
  severity: string;
}

export interface VarianceAlertResponse {
  alert: VarianceAlertRow[];
  meta: PaginationMeta;
}

export interface ProductVarianceIncident {
  id: number;
  shiftUid: string;
  baseShiftUid: string;
  inventoryUid: string;
  openingCount: number;
  addedCount: number;
  usedCount: number;
  actualCount: number;
  expectedCount: number;
  variance: number;
  createdAt: string;
  businessUid: string;
  linkedStaffCount: number;
}

export interface ProductVarianceRow {
  name: string;
  variance: ProductVarianceIncident[];
}

export interface ProductVarianceResponse {
  pv: ProductVarianceRow[];
  meta: PaginationMeta;
}

export interface ShiftContextItem {
  name: string;
  used: number;
  opening: number;
  expected: number;
  actual: number;
  unit: string;
}

export interface ShiftContextRow {
  name: string;
  date: string;
  itemsAffected: number;
  items: ShiftContextItem[];
}

export interface ShiftContextResponse {
  context: ShiftContextRow[];
  meta: PaginationMeta;
};

const REPORTS_PATHS = {
  overview: ["api/report/overview"],
  varianceAlerts: ["api/report/variance-alerts", "api/reports/varianceAlerts"],
  productVariance: ["api/report/product-variance", "api/reports/productVariance"],
  shiftContext: ["api/report/shift-context", "api/reports/shiftContext"],
};

export async function getReportsOverview(
  products: string[],
  shifts: string[],
  page: number,
  token: string
) {
  const params: string[] = [];
  if (products.length > 0) params.push(`products=${products.join(",")}`);
  if (shifts.length > 0) params.push(`shifts=${shifts.join(",")}`);
  params.push(`page=${page}`);

  const paths = REPORTS_PATHS.overview.map((p) => `${p}?${params.join("&")}`);

  const res = await apiFetchFirstSuccess<
    ApiEnvelope<OverviewReportResponse> | OverviewReportResponse
  >(paths, { token });

  return unwrapData(res);
}

export async function getVarianceAlerts(
  startDate: string,
  endDate: string,
  search: string,
  severity: string,
  page: number,
  pageLimit: number,
  token: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (search) params.append("t", search);
  if (severity && severity !== "all") params.append("severity", severity.toLowerCase());
  params.append("page", page.toString());
  if (pageLimit) params.append("pageLimit", pageLimit.toString());

  const paths = REPORTS_PATHS.varianceAlerts.map(p => `${p}?${params.toString()}`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<VarianceAlertResponse> | VarianceAlertResponse>(
    paths,
    { token }
  );
  return unwrapData(res);
}

export async function getProductVariance(
  startDate: string,
  endDate: string,
  page: number,
  pageLimit: number,
  token: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("page", page.toString());
  if (pageLimit) params.append("pageLimit", pageLimit.toString());

  const paths = REPORTS_PATHS.productVariance.map((p) => `${p}?${params.toString()}`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<ProductVarianceResponse> | ProductVarianceResponse>(
    paths,
    { token }
  );
  return unwrapData(res);
}

export async function getShiftContext(
  startDate: string,
  endDate: string,
  page: number,
  token: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("page", page.toString());

  const paths = REPORTS_PATHS.shiftContext.map((p) => `${p}?${params.toString()}`);
  const res = await apiFetchFirstSuccess<ApiEnvelope<ShiftContextResponse> | ShiftContextResponse>(
    paths,
    { token }
  );
  return unwrapData(res);
}
