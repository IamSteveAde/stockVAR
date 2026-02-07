"use client";

import { useAdmin } from "@/app/context/AdminContext";
import StatCard from "@/app/components/admin/StatCard";

export default function AdminDashboard() {
  const { restaurants, loading } = useAdmin();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  const total = restaurants.length;
  const active = restaurants.filter(
    (r) => r.subscriptionStatus === "active"
  ).length;

  const trial = restaurants.filter(
    (r) => r.subscriptionStatus === "trial"
  ).length;

  const expired = restaurants.filter(
    (r) => r.subscriptionStatus === "expired"
  ).length;

  const churnRisk = trial + expired;

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
          value={total}
        />

        <StatCard
          label="Active Subscriptions"
          value={active}
        />

        <StatCard
          label="Trials Running"
          value={trial}
        />

        <StatCard
          label="Churn Risk"
          value={churnRisk}
          variant={churnRisk > 0 ? "danger" : "default"}
          helper="Trials and expired accounts"
        />
      </div>

      {/* Admin insight */}
      <div className="bg-white rounded-xl p-6 text-sm text-gray-600">
        <strong>Insight:</strong>{" "}
        {churnRisk > 0
          ? `${churnRisk} restaurant${
              churnRisk > 1 ? "s are" : " is"
            } at risk of churn.`
          : "No immediate churn risk detected."}
      </div>
    </div>
  );
}
