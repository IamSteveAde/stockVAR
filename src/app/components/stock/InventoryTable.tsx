"use client";

import { useState } from "react";
import AdjustInventoryModal from "./AdjustInventoryModal";



export default function InventoryTable() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Inventory</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Inventory
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Item</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="py-3">Rice</td>
            <td className="font-mono text-xs">STK-RICE-A92</td>
            <td>120</td>
            <td>kg</td>
            <td>Today</td>
          </tr>
        </tbody>
      </table>

      {open && <AdjustInventoryModal onClose={() => setOpen(false)} />}
    </div>
  );
}
