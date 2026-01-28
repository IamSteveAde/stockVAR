"use client";

import { useState } from "react";

function generateSKU(name: string) {
  const prefix = name.slice(0, 3).toUpperCase();
  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
  return `STK-${prefix}-${random}`;
}

export default function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: {
    name: string;
    sku: string;
    unit: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const sku = name ? generateSKU(name) : "";

  const handleSave = () => {
    if (!name || !unit) return;

    onAdd({
      name,
      sku,
      unit,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h3 className="font-medium text-black/70">Add Product</h3>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <input
          value={sku}
          readOnly
          placeholder="SKU (auto-generated)"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-600"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select unit</option>
          <option value="kg">Kg</option>
          <option value="litres">Litres</option>
          <option value="bags">Bags</option>
          <option value="pcs">Pieces</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
  onClick={handleSave}
  disabled={!name || !unit}
  className={`px-4 py-2 rounded-lg text-sm ${
    !name || !unit
      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
      : "bg-[#0F766E] text-white"
  }`}
>
  Save
</button>

        </div>
      </div>
    </div>
  );
}
