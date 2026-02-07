"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Shift = {
  id: string;
  status: "planned" | "running" | "ended";
  startedAt?: string;
};

type Business = {
  name: string;
};

/* ================= STORAGE KEYS ================= */

const BUSINESSES_KEY = "stockvar_businesses"; // admin-level list
const SHIFTS_KEY = "stockvar_shifts";

/* ================= COMPONENT ================= */

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [activeRestaurants, setActiveRestaurants] = useState(0);
  const [avgShiftsPerDay, setAvgShiftsPerDay] = useState(0);
  const [stockAlerts, setStockAlerts] = useState(0);

  useEffect(() => {
    try {
      const businesses: Business[] = JSON.parse(
        localStorage.getItem(BUSINESSES_KEY) || "[]"
      );

      const shifts: Shift[] = JSON.parse(
        localStorage.getItem(SHIFTS_KEY) || "[]"
      );

      /* ================= DAILY ACTIVE RESTAURANTS ================= */
      const today = new Date().toDateString();

      const activeToday = new Set(
        shifts
          .filter(
            (s) =>
              s.startedAt &&
              new Date(s.startedAt).toDateString() === today
          )
          .map((s) => s.id)
      );

      setActiveRestaurants(activeToday.size || businesses.length);

      /* ================= AVG SHIFTS / DAY ================= */
      const shiftsByDay: Record<string, number> = {};

      shifts.forEach((s) => {
        if (!s.startedAt) return;
        const day = new Date(s.startedAt).toDateString();
        shiftsByDay[day] = (shiftsByDay[day] || 0) + 1;
      });

      const days = Object.keys(shiftsByDay).length;
      const totalShifts = Object.values(shiftsByDay).reduce(
        (a, b) => a + b,
        0
      );

      setAvgShiftsPerDay(
        days ? Math.round(totalShifts / days) : 0
      );

      /* ================= STOCK VARIANCE ALERTS ================= */
      // MVP logic: flag negative or zero inventory
      const inventory = JSON.parse(
        localStorage.getItem("stockvar_inventory") || "[]"
      );

      const alerts = inventory.filter(
        (i: any) => i.quantity <= 0
      ).length;

      setStockAlerts(alerts);
    } catch {
      // fallback to zeros
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-sm text-gray-500">
          System-wide usage overview (today)
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Daily Active Restaurants"
          value={loading ? "…" : activeRestaurants}
        />

        <StatCard
          label="Avg Shifts / Day"
          value={loading ? "…" : avgShiftsPerDay}
        />

        <StatCard
          label="Stock Variance Alerts"
          value={loading ? "…" : stockAlerts}
          highlight={stockAlerts > 0}
        />
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm ${
        highlight ? "border border-red-200" : ""
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-2xl font-semibold ${
          highlight ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
