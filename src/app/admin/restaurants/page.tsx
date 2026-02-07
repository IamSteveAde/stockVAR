"use client";

import Link from "next/link";
import { useAdmin } from "@/app/context/AdminContext";
import StatusBadge from "@/app/components/admin/StatusBadge";

export default function AdminRestaurants() {
  const { restaurants, loading } = useAdmin();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading restaurants…
      </div>
    );
  }

  if (!restaurants.length) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        No restaurants have been created yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Restaurants</h1>
        <span className="text-sm text-gray-500">
          {restaurants.length} total
        </span>
      </div>

      <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-4">Restaurant</th>
              <th className="p-4">City</th>
              <th className="p-4">Owner</th>
              <th className="p-4 text-center">Staff</th>
              <th className="p-4">Subscription</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {restaurants.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-teal-700">
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>

                <td className="p-4">{r.city}</td>

                <td className="p-4">
                  <div className="flex flex-col">
                    <span>{r.owner}</span>
                    <span className="text-xs text-gray-400">
                      {r.ownerEmail}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  {r.staffCount}
                </td>

                <td className="p-4">
                  <StatusBadge status={r.subscriptionStatus} />
                </td>

                <td className="p-4 text-right">
                  <Link
                    href={`/admin/restaurants/${r.id}`}
                    className="text-sm text-teal-700 hover:underline"
                  >
                    View →
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
