"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { writeAuditLog } from "../../../lib/audit";
import { useProfile } from "@/app/context/ProfileContext";


export default function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: {
    name: string;
    unit: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { profile } = useProfile();

  const handleSave = async () => {
  if (!name || !unit) return;

  setLoading(true);
  setError("");

  try {
    const product = {
      name,
      unit,
    };

    await onAdd(product);
    onClose();
  } catch (err: any) {
    setError(err.message || "Failed to create product");
    setLoading(false);
  }
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

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

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

        {/* SKU Preview */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500">
            SKU
          </label>
          <input
            value="Backend auto-generated"
            readOnly
            className="w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-100 text-gray-600 italic"
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
            {/* kg, g, mg, lb, oz, litres, ml, cl, bags, sacks, cartons, boxes, packs, crates, baskets, bundles, pieces, units, heads, bunches, cloves, bulbs, sticks */}
            <option value="g">Grams</option>
            <option value="mg">Milligrams</option>
            <option value="lb">Pounds</option>
            <option value="oz">Ounces</option>
            <option value="ml">Millilitres</option>
            <option value="cl">Centilitres</option>
            <option value="sacks">Sacks</option>
            <option value="cartons">Cartons</option>
            <option value="boxes">Boxes</option>
            <option value="packs">Packs</option>
            <option value="crates">Crates</option>
            <option value="baskets">Baskets</option>
            <option value="bundles">Bundles</option>
            <option value="units">Units</option>
            <option value="heads">Heads</option>
            <option value="bunches">Bunches</option>
            <option value="cloves">Cloves</option>
            <option value="bulbs">Bulbs</option>
            <option value="sticks">Sticks</option>
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
            disabled={!name || !unit || loading}
            className="px-4 py-2 rounded-lg text-sm bg-[#0F766E] text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
