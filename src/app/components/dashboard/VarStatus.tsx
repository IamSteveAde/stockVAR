"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Calendar, ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { getManagerOwnerVarOverview, type VarOverviewResponse } from "@/lib/api/dashboard";
import { getSession } from "@/lib/api/auth";

/* ================= TYPES ================= */

// We use the types from the dashboard API library instead.


/* ================= COMPONENT ================= */

export default function VarStatus() {
  const router = useRouter();

  const [dateRange, setDateRange] = useState<"today" | "7d" | "1m">("7d");
  const [data, setData] = useState<VarOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    async function fetchData() {
      const token = getSession()?.token;
      if (!token) return;

      setIsLoading(true);
      setError(null);
      try {
        // Note: The API endpoint structure currently might not support the dateRange parameter
        // based on the provided spec, so we fetch the general overview.
        const res = await getManagerOwnerVarOverview(token);
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load variance overview");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  const worstShift = data?.highestVarShift;

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#0F766E]">
          VAR Overview
        </h3>
        <button
          onClick={() => router.push("/dashboard/reports")}
          className="text-xs text-[#0F766E] flex items-center gap-1 hover:underline"
        >
          View full report
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={14} className="text-gray-400" />
        <select
          value={dateRange}
          onChange={(e) =>
            setDateRange(e.target.value as any)
          }
          className="border rounded-lg px-2 py-1 text-xs"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="1m">Last 30 days</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-400">
          Loading overview...
        </div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-500">
          {error}
        </div>
      ) : !data || (data.affectedShift === 0 && data.totalDiscrepancies === 0) ? (
        <div className="py-10 text-center text-sm text-gray-400">
          No variance detected
        </div>
      ) : (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">
                Affected shifts
              </p>
              <p className="text-lg font-semibold">
                {data.affectedShift}
              </p>
            </div>

            <div className="border rounded-lg p-3">
              <p className="text-xs text-gray-500">
                Total discrepancies
              </p>
              <p className="text-lg font-semibold text-red-600">
                {data.totalDiscrepancies}
              </p>
            </div>
          </div>

          {/* Worst shift */}
          {worstShift && (
            <div className="border rounded-lg p-4 bg-red-50 space-y-2">
              <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                <AlertTriangle size={14} />
                Highest variance shift
              </div>

              <p className="font-medium text-[#111827]">
                {worstShift.name} shift
              </p>

              <p className="text-xs text-gray-600">
                {new Date(worstShift.date).toLocaleDateString()} •{" "}
                {worstShift.itemsAffected} items affected
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users size={12} />
                <span className="truncate text-gray-900">
                  {worstShift.staffInCharge}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
