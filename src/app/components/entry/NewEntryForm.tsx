"use client";

import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const PRODUCTS = [
  "Rice",
  "Cooking Oil",
  "Chicken",
  "Tomatoes",
  "Milk",
];

export default function NewEntryForm() {
  const [type, setType] = useState<"in" | "out">("out");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          New Stock Entry
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Record stock coming in or going out.
        </p>
      </div>

      {/* Auto Info (READ ONLY) */}
      <div className="grid sm:grid-cols-2 gap-4 bg-[#F9FAFB] border rounded-xl p-4 text-sm">
        <div>
          <p className="text-gray-500">Staff on duty</p>
          <p className="font-medium text-gray-900">Auto-assigned</p>
        </div>
        <div>
          <p className="text-gray-500">Date & time</p>
          <p className="font-medium text-gray-900">Auto-recorded</p>
        </div>
      </div>

      {/* Entry Type */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          What are you doing?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setType("in")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition ${
              type === "in"
                ? "border-[#0F766E] bg-[#0F766E]/5"
                : "hover:bg-gray-50"
            }`}
          >
            <ArrowUpCircle className="text-[#0F766E]" />
            <div className="text-left">
              <p className="font-medium">Stock In</p>
              <p className="text-xs text-gray-500">
                Adding new stock
              </p>
            </div>
          </button>

          <button
            onClick={() => setType("out")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition ${
              type === "out"
                ? "border-red-500 bg-red-50"
                : "hover:bg-gray-50"
            }`}
          >
            <ArrowDownCircle className="text-red-500" />
            <div className="text-left">
              <p className="font-medium">Stock Out</p>
              <p className="text-xs text-gray-500">
                Removing stock
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Product */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Product
        </label>
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
          className="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#0F766E] outline-none"
        >
          <option value="">Select product</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#0F766E] outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#0F766E] outline-none"
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="bag">Bag</option>
            <option value="crate">Crate</option>
            <option value="litre">Litre</option>
            <option value="unit">Unit</option>
          </select>
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#0F766E] outline-none"
        >
          <option value="">Select reason</option>
          {type === "in" ? (
            <>
              <option>New purchase</option>
              <option>Supplier delivery</option>
              <option>Stock correction</option>
            </>
          ) : (
            <>
              <option>Served customers</option>
              <option>Kitchen use</option>
              <option>Wastage / spoilage</option>
              <option>Adjustment</option>
            </>
          )}
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#0F766E] outline-none"
          placeholder="Extra details if needed"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-6 py-3 text-sm rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-3 text-sm rounded-lg bg-[#0F766E] text-white hover:bg-[#0B5F58]"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
}