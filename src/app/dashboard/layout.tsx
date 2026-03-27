"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
import { BusinessProvider, useBusiness } from "../context/BusinessContext";
import { SubscriptionProvider } from "../context/SubscriptionContext";
import TrialBanner from "../components/billing/TrialBanner";
import DevProfileSwitcher from "@/app/dev/DevProfileSwitcher";
import { isOnboardingComplete } from "@/lib/onboarding";

/* ================= ROLE GUARD ================= */

function RoleGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const { isHydrated } = useBusiness();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!profile || !isHydrated) return;

    // 🚫 Staff must never access dashboard root
    if (profile.role === "staff" && pathname === "/dashboard") {
      router.replace("/dashboard/staff-dashboard");
      return;
    }

    const requiresOnboarding = profile.role === "owner" || profile.role === "manager";
    if (requiresOnboarding && !isOnboardingComplete()) {
      router.replace("/onboarding/create-business");
    }
  }, [isHydrated, profile, pathname, router]);

  if (!profile || !isHydrated) return null;

  return <>{children}</>;
}

/* ================= LAYOUT ================= */

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

            {/* ✅ DEV ONLY ROLE SWITCHER */}
            {process.env.NODE_ENV === "development" && (
              <DevProfileSwitcher />
            )}
          </RoleGuard>
        </SubscriptionProvider>
      </BusinessProvider>
    </ProfileProvider>
  );
}
