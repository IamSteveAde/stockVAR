"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/app/context/AdminContext";

/* ================= TYPES ================= */

type Staff = {
  id: string;
  fullName: string;
  role: "owner" | "manager" | "staff";
  status: "active" | "invited" | "archived";
  restaurantId: string;
};

/* ================= STORAGE ================= */

const STAFF_KEY = "stockvar_staff";

/* ================= COMPONENT ================= */

export default function AdminUsersPage() {
  const { restaurants } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Staff[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STAFF_KEY);
      setUsers(raw ? JSON.parse(raw) : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        Loading users…
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
        No users found.
      </div>
    );
  }

  /* ================= DERIVED STATS ================= */

  const total = users.length;
  const owners = users.filter((u) => u.role === "owner").length;
  const managers = users.filter((u) => u.role === "manager").length;
  const staff = users.filter((u) => u.role === "staff").length;
  const inactive = users.filter(
    (u) => u.status !== "active"
  ).length;

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
        <SummaryCard label="Total users" value={total} />
        <SummaryCard label="Owners" value={owners} />
        <SummaryCard label="Managers" value={managers} />
        <SummaryCard label="Staff" value={staff} />
        <SummaryCard
          label="Inactive"
          value={inactive}
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
