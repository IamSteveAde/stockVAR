"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  Users,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

import { getSession } from "@/lib/api/auth";
import { getManagerOwnerDashboardMetrics, type DashboardMetricsData } from "@/lib/api/dashboard";

/* ================= COMPONENT ================= */

export default function OverviewCards() {
  const router = useRouter();

  const [metrics, setMetrics] = useState<DashboardMetricsData>({
    stockCount: 0,
    unresolvedVar: 0,
    staff: 0,
  });
  
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      const session = getSession();
      if (!session?.token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getManagerOwnerDashboardMetrics(session.token);
        if (mounted && data) {
          setMetrics({
            stockCount: data.stockCount || 0,
            unresolvedVar: data.unresolvedVar || 0,
            staff: data.staff || 0,
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMetrics();

    // Trigger refresh when requested elsewhere in the app
    const handleRefresh = () => {
      setLoading(true);
      void loadMetrics();
    };

    window.addEventListener("stockvar:updated", handleRefresh);
    return () => {
      mounted = false;
      window.removeEventListener("stockvar:updated", handleRefresh);
    };
  }, []);

  /* ================= METRICS ================= */

  const totalItems = metrics.stockCount;
  const activeStaffCount = metrics.staff;
  const unresolvedVariance = metrics.unresolvedVar;

  /* ================= CARD CONFIG ================= */

  const cards = [
    {
      title: "Stock Items",
      value: totalItems.toString(),
      icon: Package,
    },
    {
      title: "Unresolved VAR",
      value:
        unresolvedVariance === 0
          ? "0"
          : unresolvedVariance > 0
          ? `+${unresolvedVariance}`
          : `${unresolvedVariance}`,
      icon: AlertTriangle,
      tone:
        unresolvedVariance < 0
          ? "text-red-600"
          : unresolvedVariance > 0
          ? "text-green-600"
          : "",
    },
    {
      title: "Staff",
      value: activeStaffCount.toString(),
      icon: Users,
    },
    {
      title: "Reports",
      value: "View",
      icon: BarChart,
      action: () => router.push("/dashboard/reports"),
    },
  ];

  /* ================= UI ================= */

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(
        ({ title, value, icon: Icon, action, tone }) => (
          <div
            key={title}
            onClick={action}
            className={`bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm ${
              action
                ? "cursor-pointer hover:bg-gray-50"
                : ""
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
              <Icon size={18} className="text-[#0F766E]" />
            </div>

            <div>
              <p className="text-xs text-gray-500">{title}</p>
              <p
                className={`text-lg font-semibold ${
                  tone || ""
                }`}
              >
                {value}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
