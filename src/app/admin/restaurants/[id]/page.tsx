"use client";

import { useParams, notFound } from "next/navigation";
import { useAdmin } from "@/app/context/AdminContext";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Link from "next/link";

export default function AdminRestaurantDetail() {
  const params = useParams<{ id: string }>();
  const { restaurants, loading } = useAdmin();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl text-sm text-gray-500">
        Loading restaurant…
      </div>
    );
  }

  const restaurant = restaurants.find(
    (r) => r.id === params.id
  );

  if (!restaurant) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {restaurant.name}
          </h1>
          <p className="text-sm text-gray-500">
            {restaurant.city}
          </p>
        </div>

        <StatusBadge status={restaurant.subscriptionStatus} />
      </div>

      {/* Overview cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard label="Owner">
          <p className="font-medium">{restaurant.owner}</p>
          <p className="text-xs text-gray-400">
            {restaurant.ownerEmail}
          </p>
        </InfoCard>

        <InfoCard label="Staff">
          <p className="text-2xl font-semibold">
            {restaurant.staffCount}
          </p>
          <p className="text-xs text-gray-400">
            Active staff
          </p>
        </InfoCard>

        <InfoCard label="Last Activity">
          <p className="font-medium">
            {restaurant.lastActivity || "—"}
          </p>
          <p className="text-xs text-gray-400">
            Most recent shift
          </p>
        </InfoCard>
      </div>

      {/* Admin actions */}
      <div className="bg-white rounded-xl p-6 space-y-4">
        <h2 className="font-medium">Admin actions</h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/restaurants/${restaurant.id}/impersonate`}
            className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            View as restaurant
          </Link>

          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm border text-red-600 opacity-60"
          >
            Suspend account
          </button>

          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm border opacity-60"
          >
            View audit logs
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Some actions are disabled in MVP mode.
        </p>
      </div>

      {/* Meta information */}
      <div className="bg-white rounded-xl p-6 space-y-2 text-sm">
        <h2 className="font-medium">Metadata</h2>

        <MetaRow label="Restaurant ID" value={restaurant.id} />
        <MetaRow label="Created at" value={restaurant.createdAt} />
        <MetaRow label="Subscription status">
          <StatusBadge status={restaurant.subscriptionStatus} />
        </MetaRow>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-1">
      <p className="text-xs text-gray-500">{label}</p>
      {children}
    </div>
  );
}

function MetaRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center border-t py-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">
        {children ?? value ?? "—"}
      </span>
    </div>
  );
}
