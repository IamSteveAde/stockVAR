import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function logout(router: AppRouterInstance) {
  // Clear mock auth/session data
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login
  router.push("/auth/login");
}