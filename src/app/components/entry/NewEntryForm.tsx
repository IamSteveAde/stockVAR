"use client";

import { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import { addEntry, listProducts, type ProductRecord } from "@/lib/api/stock";
import { listShifts, type ShiftRecord } from "@/lib/api/shifts";
import { getSession } from "@/lib/api/auth";

export default function NewEntryForm() {
  const { profile } = useProfile();

  const [type, setType] = useState<"in" | "out">("out");
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [activeShift, setActiveShift] = useState<ShiftRecord | null>(null);

  const [inventoryUid, setInventoryUid] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  /* ================= LOAD DATA ================= */

  const loadData = async () => {
    const token = getSession()?.token;
    if (!token) return;

    try {
      const [prodRes, shiftRes] = await Promise.all([
        listProducts(token, 1, 100),
        listShifts(token, 1, 1, "Running")
      ]);

      if (prodRes?.products) {
        setProducts(prodRes.products);
      }
      
      if (shiftRes?.shifts?.length > 0) {
        setActiveShift(shiftRes.shifts[0]);
      } else {
        setActiveShift(null);
      }
    } catch (err) {
      console.error("Failed to load active shift and products", err);
    }
  };

  useEffect(() => {
    loadData();

    window.addEventListener("shifts:updated", loadData);
    return () => {
      window.removeEventListener("shifts:updated", loadData);
    };
  }, []);

  /* ================= SAVE ENTRY ================= */

  const handleSave = async () => {
    // if (profile.role !== "staff") {
    //   alert("Only staff members can update stock entries.");
    //   return;
    // }

    const token = getSession()?.token;
    if (!token) {
      alert("Your session has expired. Please log in again.");
      return;
    }

    if (!activeShift) {
      alert("No running shift. Start a shift first.");
      return;
    }

    if (!inventoryUid || !quantity) return;

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) return;

    try {
      await addEntry(
        {
          quantity: qty,
          inventoryUid,
          action: type === "in" ? "Stock In" : "Stock Out",
          shiftUid: activeShift.uid,
        },
        token
      );

      /* ================= RESET ================= */

      setInventoryUid("");
      setQuantity("");
      setReason("");

      alert("Stock entry saved");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? ((error as { message: string }).message)
          : "Stock entry rejected by authorization checks.";

      alert(message);
    }
  };

  /* ================= UI ================= */

  if (!activeShift) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-red-600">
        ⚠️ No running shift.
        <br />
        Start a shift before recording stock movements.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
      <h2 className="text-xl font-semibold">New Stock Entry</h2>

      <div className="bg-gray-50 border rounded-xl p-4 text-sm">
        <p className="text-gray-500">Active shift</p>
        <p className="font-medium">
          {activeShift.name} ({activeShift.startTime} –{" "}
          {activeShift.endTime})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setType("in")}
          className={`p-4 border rounded-xl flex items-center gap-2 ${
            type === "in"
              ? "border-[#0F766E] bg-[#0F766E]/10"
              : ""
          }`}
        >
          <ArrowUpCircle /> Stock In
        </button>

        <button
          onClick={() => setType("out")}
          className={`p-4 border rounded-xl flex items-center gap-2 ${
            type === "out"
              ? "border-red-500 bg-red-50"
              : ""
          }`}
        >
          <ArrowDownCircle /> Stock Out
        </button>
      </div>

      <select
        value={inventoryUid}
        onChange={(e) => setInventoryUid(e.target.value)}
        className="w-full border rounded-lg px-4 py-3"
      >
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p.uid} value={p.inventoryUid || p.uid}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full border rounded-lg px-4 py-3"
      />

      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="w-full border rounded-lg px-4 py-3"
      />

      <button
        onClick={() => {
          void handleSave();
        }}
        disabled={!inventoryUid || !quantity}
        className="bg-[#0F766E] text-white px-6 py-3 rounded-lg"
      >
        Save Entry
      </button>
    </div>
  );
}
