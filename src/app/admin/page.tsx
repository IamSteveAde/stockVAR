"use client";

import { useAdmin } from "@/app/context/AdminContext";
import { useEffect, useState } from "react";
import StatCard from "@/app/components/admin/StatCard";
import { getAdminOverviewMetric } from "@/lib/api/admin";
import { getSession } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { loading: contextLoading } = useAdmin();

  const [metrics, setMetrics] = useState({
    totalRestaurants: 0,
    activeSubscription: 0,
    trialRunning: 0,
    churnRisk: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadMetrics() {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }
      
      try {
        const [totalRes, activeRes, trialRes, churnRes] = await Promise.all([
          getAdminOverviewMetric(token, "total-restaurants"),
          getAdminOverviewMetric(token, "active-subscription"),
          getAdminOverviewMetric(token, "trial-running"),
          getAdminOverviewMetric(token, "churn-risk")
        ]);

        setMetrics({
          totalRestaurants: totalRes?.count || 0,
          activeSubscription: activeRes?.count || 0,
          trialRunning: trialRes?.count || 0,
          churnRisk: churnRes?.count || 0,
        });
      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("expired")) {
             router.push("/auth/login");
        }
        console.error("Failed loading admin metrics", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading dashboard…
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Admin Overview
        </h1>
        <p className="text-sm text-gray-500">
          System-wide snapshot
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Total Restaurants"
          value={metrics.totalRestaurants}
        />

        <StatCard
          label="Active Subscriptions"
          value={metrics.activeSubscription}
        />

        <StatCard
          label="Trials Running"
          value={metrics.trialRunning}
        />

        <StatCard
          label="Churn Risk"
          value={metrics.churnRisk}
          variant={metrics.churnRisk > 0 ? "danger" : "default"}
          helper="Trials and expired accounts"
        />
      </div>

      {/* Admin insight */}
      <div className="bg-white rounded-xl p-6 text-sm text-gray-600">
        <strong>Insight:</strong>{" "}
        {metrics.churnRisk > 0
          ? `${metrics.churnRisk} restaurant${
              metrics.churnRisk > 1 ? "s are" : " is"
            } at risk of churn.`
          : "No immediate churn risk detected."}
      </div>
    </div>
  );
}
