"use client";

import { useState } from "react";
import OverviewReport from "./OverviewReport";
import VarianceAlerts from "./VarianceAlerts";
import ProductVariance from "./ProductVariance";
import ShiftContext from "./ShiftContext";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "alerts", label: "Variance Alerts" },
  { id: "products", label: "Product Variance" },
  { id: "shifts", label: "Shift Context" },
];

export default function ReportsTabs() {
  const [active, setActive] = useState("overview");

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap ${
              active === t.id
                ? "border-b-2 border-[#0F766E] text-[#0F766E]"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {active === "overview" && <OverviewReport />}
        {active === "alerts" && <VarianceAlerts />}
        {active === "products" && <ProductVariance />}
        {active === "shifts" && <ShiftContext />}
      </div>
    </div>
  );
}