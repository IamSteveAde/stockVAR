"use client";

import { useEffect, useState } from "react";
import OverviewCards from "./OverviewCards";
import VarStatus from "./VarStatus";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import VarianceChart from "./VarianceChart";
import { Shift } from "../shifts/types";

import { getSession } from "@/lib/api/auth";
import { getManagerOwnerVarSummary, type VarSummaryItem } from "@/lib/api/dashboard";

/* ================= COMPONENT ================= */

export default function DashboardLayout() {
  const [varianceData, setVarianceData] = useState<VarSummaryItem[]>([]);

  /* ================= LOAD DASHBOARD VARIANCE ================= */

  useEffect(() => {
    let mounted = true;

    async function loadVariance() {
      const session = getSession();
      if (!session?.token) return;

      try {
        const response = await getManagerOwnerVarSummary(session.token);
        if (mounted && response?.data) {
          const sorted = [...response.data]
            .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
            .slice(0, 6);
          setVarianceData(sorted);
        }
      } catch (err) {
        console.error("Failed to load variance summary", err);
      }
    }

    loadVariance();

    const handleRefresh = () => {
      void loadVariance();
    };

    window.addEventListener("stockvar:updated", handleRefresh);
    return () => {
      mounted = false;
      window.removeEventListener("stockvar:updated", handleRefresh);
    };
  }, []);

  /* ================= UI ================= */

  return (
    <main className="p-4 space-y-6">
      <OverviewCards />

     <div className="grid lg:grid-cols-2 gap-6 items-stretch">
  <VarianceChart data={varianceData} />
  <VarStatus />
</div>


      <RecentActivity data={varianceData} />
      <QuickActions />
    </main>
  );
}
