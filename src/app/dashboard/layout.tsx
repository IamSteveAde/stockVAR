"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
import { BusinessProvider } from "../context/BusinessContext";
import { SubscriptionProvider } from "../context/SubscriptionContext";
import TrialBanner from "../components/billing/TrialBanner";
import DevProfileSwitcher from "@/app/dev/DevProfileSwitcher";

/* ================= ROLE GUARD ================= */

function RoleGuard({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!profile) return;

    // 🚫 Staff must never access dashboard root
    if (profile.role === "staff" && pathname === "/dashboard") {
      router.replace("/dashboard/staff-dashboard");
    }
  }, [profile, pathname, router]);

  if (!profile) return null;

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
