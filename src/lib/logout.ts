import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clearSession } from "@/lib/api/auth";

export function logout(router: AppRouterInstance) {
  clearSession();
  sessionStorage.clear();
  router.push("/auth/login");
}