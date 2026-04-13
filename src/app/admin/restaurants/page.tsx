"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/app/components/admin/StatusBadge";
import { getSession } from "@/lib/api/auth";
import { listAdminRestaurants } from "@/lib/api/admin";
import { useRouter } from "next/navigation";

export default function AdminRestaurants() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    async function hydrateList() {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }
      setLoading(true);
      try {
        const list: any = await listAdminRestaurants(token, page);
        if (list && Array.isArray(list.businesses)) {
            // Re-map into UI friendly shape natively
            const mapped = list.businesses.map((b: any) => ({
              id: b.uid || b.id,
              name: b.name,
              city: b.city || "Unknown",
              owner: b.owner?.name || "Unknown",
              ownerEmail: b.owner?.email || "No email",
              staffCount: b.staffSize || 0,
              subscriptionStatus: b.subscriptionStatus?.toLowerCase() || "expired",
            }));
            setRestaurants(mapped);
            setMeta(list.meta);
        }
      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("expired")) {
             router.push("/auth/login");
        }
        console.error("Failed loading restaurants", err);
      } finally {
        setLoading(false);
      }
    }
    hydrateList();
  }, [page]);

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
        {meta && (
          <span className="text-sm text-gray-500">
            {meta.totalCount} total
          </span>
        )}
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
