"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      {/* Modal */}
      <div className="bg-white w-full max-w-sm rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base text-black/80">
            Add Product
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product name */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            Product name
          </label>
          <input
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        {/* SKU */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            SKU
          </label>
          <input
            value={sku}
            readOnly
            placeholder="Auto-generated"
            className="w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-100 text-gray-600"
          />
        </div>

        {/* Unit */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="">Select unit</option>
            <option value="kg">Kg</option>
            <option value="litres">Litres</option>
            <option value="bags">Bags</option>
            <option value="pcs">Pieces</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !unit}
            className="px-4 py-2 rounded-lg text-sm bg-[#0F766E] text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
