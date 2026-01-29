"use client";

import { useState } from "react";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
        <h3 className="font-medium">Adjust Inventory</h3>

        {/* Product selector */}
        <select
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.sku} value={p.sku}>
              {p.name} — {p.sku}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        <select
          value={action}
          onChange={(e) =>
            setAction(e.target.value as "add" | "reduce")
          }
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="add">Add stock</option>
          <option value="reduce">Reduce stock</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm text-gray-500">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!sku || !quantity}
            className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
