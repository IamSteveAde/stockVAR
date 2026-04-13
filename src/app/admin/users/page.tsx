"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/api/auth";
import { getAdminUserMetric } from "@/lib/api/admin";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    owners: 0,
    managers: 0,
    staff: 0,
    inactive: 0,
  });

  useEffect(() => {
    async function hydrate() {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const [totalM, ownerM, managerM, staffM, inactiveM] = await Promise.all([
          getAdminUserMetric(token, "total"),
          getAdminUserMetric(token, "owner"),
          getAdminUserMetric(token, "manager"),
          getAdminUserMetric(token, "staff"),
          getAdminUserMetric(token, "inactive"),
        ]);

        setMetrics({
          total: totalM?.count || 0,
          owners: ownerM?.count || 0,
          managers: managerM?.count || 0,
          staff: staffM?.count || 0,
          inactive: inactiveM?.count || 0,
        });

      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("expired")) {
             router.push("/auth/login");
        }
        console.error("Failed loading user metrics", err);
      } finally {
        setLoading(false);
      }
    }
    
    hydrate();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading user analytics…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Users</h1>
        <p className="text-sm text-gray-500">
          All users across all restaurants
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-5 gap-4">
        <SummaryCard label="Total users" value={metrics.total} />
        <SummaryCard label="Owners" value={metrics.owners} />
        <SummaryCard label="Managers" value={metrics.managers} />
        <SummaryCard label="Staff" value={metrics.staff} />
        <SummaryCard
          label="Inactive"
          value={metrics.inactive}
          danger
        />
      </div>

      {/* Table (MVP) */}
      <div className="bg-white rounded-xl p-6 text-sm text-gray-600">
        User table and management actions coming next.
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function SummaryCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm ${
        danger ? "border border-red-200" : ""
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-2xl font-semibold ${
          danger ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
