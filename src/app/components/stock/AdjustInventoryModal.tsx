"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Product = {
  sku: string;
  name: string;
  unit: string;
};

export default function AdjustInventoryModal({
  products,
  onClose,
  onSave,
}: {
  products: Product[];
  onClose: () => void;
  onSave: (data: {
    sku: string;
    quantity: number;
    action: "add" | "reduce";
  }) => void;
}) {
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [action, setAction] = useState<"add" | "reduce">("add");

  const submit = () => {
    if (!sku || !quantity) return;

    onSave({
      sku,
      quantity: Number(quantity),
      action,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      {/* Modal */}
      <div className="bg-white w-full max-w-sm rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">
            Adjust Inventory
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product selector */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            Product
          </label>
          <select
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.sku} value={p.sku}>
                {p.name} — {p.sku}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        {/* Action */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            Action
          </label>
          <select
            value={action}
            onChange={(e) =>
              setAction(e.target.value as "add" | "reduce")
            }
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="add">Add stock</option>
            <option value="reduce">Reduce stock</option>
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
            onClick={submit}
            disabled={!sku || !quantity}
            className="px-4 py-2 rounded-lg text-sm bg-[#0F766E] text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
