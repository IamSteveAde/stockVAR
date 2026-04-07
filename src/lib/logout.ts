import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clearSession } from "@/lib/api/auth";

export function logout(router: AppRouterInstance) {
  clearSession();
  if (typeof window !== "undefined") {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith("stockvar_profile:")) {
        localStorage.removeItem(key);
      }
      if (key.startsWith("stockvar_business:")) {
        localStorage.removeItem(key);
      }
    }
  }
  sessionStorage.clear();
  router.push("/auth/login");
}