"use client";

import { useState } from "react";

export default function AdjustInventoryModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h3 className="font-medium">Adjust Inventory</h3>

        <select className="w-full border rounded-lg px-3 py-2 text-sm">
          <option>Select product (SKU)</option>
          <option>Rice — STK-RICE-A92</option>
          <option>Oil — STK-OIL-K11</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <select className="w-full border rounded-lg px-3 py-2 text-sm">
          <option>Add stock</option>
          <option>Reduce stock</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>
          <button className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
