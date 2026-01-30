"use client";

import { useEffect, useState } from "react";
import OverviewCards from "./OverviewCards";
import VarStatus from "./VarStatus";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import VarianceChart from "./VarianceChart";
import { Shift } from "../shifts/types";

/* ================= TYPES ================= */

type Product = {
  sku: string;
  name: string;
  unit: string;
};

type InventoryLog = {
  sku: string;
  quantity: number;
  action: "in" | "out";
  shiftId: string;
};

type StockSnapshot = {
  sku: string;
  quantity: number;
};

type VarianceRow = {
  name: string;
  variance: number;
};

/* ================= COMPONENT ================= */

export default function DashboardLayout() {
  const [varianceData, setVarianceData] = useState<VarianceRow[]>([]);

  /* ================= LOAD DASHBOARD VARIANCE ================= */

  useEffect(() => {
    const products: Product[] = JSON.parse(
      localStorage.getItem("stockvar_products") || "[]"
    );

    const shifts: Shift[] = JSON.parse(
      localStorage.getItem("stockvar_shifts") || "[]"
    );

    const logs: InventoryLog[] = JSON.parse(
      localStorage.getItem("stockvar_inventory_logs") || "[]"
    );

    const endedShifts = shifts
      .filter(
        (s) =>
          s.status === "ended" &&
          s.openingSnapshot &&
          s.closingSnapshot
      )
      .slice(-5);

    const result: VarianceRow[] = products.map((p) => {
      let variance = 0;

      endedShifts.forEach((shift) => {
        const opening =
          shift.openingSnapshot!.find(
            (i: StockSnapshot) => i.sku === p.sku
          )?.quantity || 0;

        const closing =
          shift.closingSnapshot!.find(
            (i: StockSnapshot) => i.sku === p.sku
          )?.quantity || 0;

        const shiftLogs = logs.filter(
          (l) => l.shiftId === shift.id && l.sku === p.sku
        );

        const added = shiftLogs
          .filter((l) => l.action === "in")
          .reduce((s, l) => s + l.quantity, 0);

        const used = shiftLogs
          .filter((l) => l.action === "out")
          .reduce((s, l) => s + l.quantity, 0);

        variance += closing - (opening + added - used);
      });

      return { name: p.name, variance };
    });

    setVarianceData(
      result
        .filter((r) => r.variance !== 0)
        .sort(
          (a, b) => Math.abs(b.variance) - Math.abs(a.variance)
        )
        .slice(0, 6)
    );
  }, []);

  /* ================= UI ================= */

  return (
    <main className="p-4 space-y-6">
      <OverviewCards />

     <div className="grid lg:grid-cols-2 gap-6 items-stretch">
  <VarianceChart data={varianceData} />
  <VarStatus />
</div>


      <RecentActivity />
      <QuickActions />
    </main>
  );
}
