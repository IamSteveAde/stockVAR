import { apiFetchFirstSuccess } from "./client";
import { unwrapData, type ApiEnvelope } from "./response";

const REPORTS_PATHS = {
  overview: ["api/reports/overview"],
  varianceAlerts: ["api/reports/variance-alerts", "api/reports/varianceAlerts"],
  productVariance: ["api/reports/product-variance", "api/reports/productVariance"],
  shiftContext: ["api/reports/shift-context", "api/reports/shiftContext"],
};

export async function getReportsOverview(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    REPORTS_PATHS.overview,
    { token }
  );
  return unwrapData(res);
}

export async function getVarianceAlerts(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<unknown[]> | unknown[]>(
    REPORTS_PATHS.varianceAlerts,
    { token }
  );
  return unwrapData(res);
}

export async function getProductVariance(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<unknown[]> | unknown[]>(
    REPORTS_PATHS.productVariance,
    { token }
  );
  return unwrapData(res);
}

export async function getShiftContext(token: string) {
  const res = await apiFetchFirstSuccess<ApiEnvelope<unknown> | unknown>(
    REPORTS_PATHS.shiftContext,
    { token }
  );
  return unwrapData(res);
}
