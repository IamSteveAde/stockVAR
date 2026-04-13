"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { getSession } from "@/lib/api/auth";
import { getAdminSubscriptionMetric, listAdminSubscriptions } from "@/lib/api/admin";
import { useRouter } from "next/navigation";

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    active: 0,
    trial: 0,
    expired: 0,
  });
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    async function hydrateMetrics() {
      const token = getSession()?.token;
      if (!token) return;
      try {
        const [activeM, trialM, expiredM] = await Promise.all([
          getAdminSubscriptionMetric(token, "active"),
          getAdminSubscriptionMetric(token, "trial"),
          getAdminSubscriptionMetric(token, "expired"),
        ]);
        setMetrics({
          active: activeM?.count || 0,
          trial: trialM?.count || 0,
          expired: expiredM?.count || 0,
        });
      } catch (err) {
        console.error("Failed loading subscription metrics", err);
      }
    }
    hydrateMetrics();
  }, []);

  useEffect(() => {
    async function hydrateList() {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }
      setLoading(true);
      try {
        const list: any = await listAdminSubscriptions(token, page);
        if (list && Array.isArray(list.businesses)) {
            setSubscriptions(list.businesses);
            setMeta(list.meta);
        }

      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("expired")) {
             router.push("/auth/login");
        }
        console.error("Failed loading subscription metrics", err);
      } finally {
        setLoading(false);
      }
    }
    hydrateList();
  }, [page]);

  // We gracefully handle loading to not block the metrics overview but wait for list.
  if (loading && subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading subscriptions overview…
      </div>
    );
  }

  if (!subscriptions.length) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        No subscriptions found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">
          Subscriptions
        </h1>
        <p className="text-sm text-gray-500">
          Manage restaurant billing status
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard label="Active" value={metrics.active} />
        <SummaryCard label="Trial" value={metrics.trial} />
        <SummaryCard
          label="Expired"
          value={metrics.expired}
          danger
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 text-left">Restaurant</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Last activity</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((r) => (
              <tr
                key={r.uid}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/admin/restaurants/${r.uid}`}
                    className="text-teal-700 hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span>{r.owner?.name || "Unknown"}</span>
                    <span className="text-xs text-gray-400">
                      {r.owner?.email || ""}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <StatusBadge status={r.subscriptionStatus?.toLowerCase()} />
                </td>

                <td className="p-4 text-gray-500">
                  {r.lastActivity || "—"}
                </td>

                <td className="p-4 text-right">
                  <Link
                    href={`/admin/restaurants/${r.uid}`}
                    className="text-sm text-teal-700 hover:underline"
                  >
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {meta && (
          <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing Page {meta.currentPage} of {meta.pageCount} ({meta.totalCount} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.isFirstPage}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={meta.isLastPage}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
