"use client";

import { useState } from "react";
import AdjustInventoryModal from "./AdjustInventoryModal";

type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  updatedAt: string;
};

// Mock data (later backend-driven)
const INVENTORY: InventoryItem[] = [
  {
    id: 1,
    name: "Rice",
    sku: "STK-RICE-A92",
    quantity: 120,
    unit: "kg",
    updatedAt: "Today",
  },
  {
    id: 2,
    name: "Oil",
    sku: "STK-OIL-B11",
    quantity: 45,
    unit: "litres",
    updatedAt: "Yesterday",
  },
];

export default function InventoryTable() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Inventory</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0B5F58]"
        >
          Add Inventory
        </button>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden space-y-3">
        {INVENTORY.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{item.name}</p>
              <span className="text-sm font-semibold">
                {item.quantity} {item.unit}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              SKU: <span className="font-mono">{item.sku}</span>
            </p>

            <p className="text-xs text-gray-400">
              Last updated: {item.updatedAt}
            </p>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 bg-gray-50">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {INVENTORY.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 font-mono text-xs">
                  {item.sku}
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.unit}</td>
                <td className="px-6 py-4 text-gray-500">
                  {item.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && <AdjustInventoryModal onClose={() => setOpen(false)} />}
    </div>
  );
}