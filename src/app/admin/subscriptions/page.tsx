"use client";

import Link from "next/link";
import { useAdmin } from "@/app/context/AdminContext";
import StatusBadge from "@/app/components/admin/StatusBadge";

export default function AdminSubscriptionsPage() {
  const { restaurants, loading } = useAdmin();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading subscriptions…
      </div>
    );
  }

  if (!restaurants.length) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        No subscriptions found.
      </div>
    );
  }

  const totals = restaurants.reduce(
    (acc, r) => {
      acc[r.subscriptionStatus] =
        (acc[r.subscriptionStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

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
        <SummaryCard label="Active" value={totals.active || 0} />
        <SummaryCard label="Trial" value={totals.trial || 0} />
        <SummaryCard
          label="Expired"
          value={totals.expired || 0}
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
            {restaurants.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="text-teal-700 hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span>{r.owner}</span>
                    <span className="text-xs text-gray-400">
                      {r.ownerEmail}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <StatusBadge status={r.subscriptionStatus} />
                </td>

                <td className="p-4 text-gray-500">
                  {r.lastActivity || "—"}
                </td>

                <td className="p-4 text-right">
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="text-sm text-teal-700 hover:underline"
                  >
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
