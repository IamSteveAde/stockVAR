"use client";

import { useState } from "react";
import ProductsTable from "./ProductsTable";
import InventoryTable from "./InventoryTable";

export default function StockTabs() {
  const [tab, setTab] = useState<"products" | "inventory">("products");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex gap-6 border-b">
        <button
          onClick={() => setTab("products")}
          className={`pb-2 text-sm ${
            tab === "products"
              ? "border-b-2 border-[#0F766E] text-[#0F766E]"
              : "text-gray-500"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setTab("inventory")}
          className={`pb-2 text-sm ${
            tab === "inventory"
              ? "border-b-2 border-[#0F766E] text-[#0F766E]"
              : "text-gray-500"
          }`}
        >
          Inventory
        </button>
      </div>

      {tab === "products" && <ProductsTable />}
      {tab === "inventory" && <InventoryTable />}
    </div>
  );
}
