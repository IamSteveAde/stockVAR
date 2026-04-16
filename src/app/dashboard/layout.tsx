"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
import { BusinessProvider, useBusiness } from "../context/BusinessContext";
import { SubscriptionProvider, useSubscription } from "../context/SubscriptionContext";
import TrialBanner from "../components/billing/TrialBanner";

/* ================= ROLE GUARD ================= */

function RoleGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const { business, isHydrated } = useBusiness();
  const { subscription } = useSubscription();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!profile || !isHydrated) return;

    // 🚫 Staff must never access dashboard root
    if (profile.role === "staff" && pathname === "/dashboard") {
      router.replace("/dashboard/shift");
      return;
    }

    // 🚫 Owner/Manager must have completed onboarding (business profile exists)
    const requiresOnboarding =
      profile.role === "owner" || profile.role === "manager";

    if (requiresOnboarding && !business) {
      // No business profile = not onboarded yet
      router.replace("/onboarding/create-business");
      return;
    }

    // 🚫 Owner must have active sub, else trapped strictly to billing
    const hasActiveSub = subscription?.status === "active" || subscription?.status === "trial";
    if (profile.role === "owner" && !hasActiveSub && pathname !== "/dashboard/billing") {
      router.replace("/dashboard/billing");
      return;
    }

  }, [isHydrated, profile, business, subscription?.status, pathname, router]);

  if (!profile || !isHydrated) return null;

  // 🚫 Global Sub Guard for Managers & Staff
  const isEmployee = profile.role === "manager" || profile.role === "staff";
  const hasActiveSub = subscription?.status === "active" || subscription?.status === "trial";
  
  if (isEmployee && !hasActiveSub) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-xl shadow-lg border text-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Subscription required
          </h2>

          <p className="text-sm text-gray-600">
            Your organisation's subscription has expired.
          </p>

          <p className="text-sm text-gray-600">
            Please contact the <strong>account owner</strong> to
            renew the subscription so you can continue using StockVAR.
          </p>
          
          <div className="pt-6">
            <button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/auth/login";
              }}
              className="px-6 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProfileProvider>
      <BusinessProvider>
        <SubscriptionProvider>
          <RoleGuard>
            <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
              <Sidebar
                open={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              />

              <div className="flex-1 flex flex-col min-w-0">
                {/* Display-only banner */}
                <TrialBanner />

                <Topbar toggleSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </RoleGuard>
        </SubscriptionProvider>
      </BusinessProvider>
    </ProfileProvider>
  );
}
