"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Staff, Shift } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;

  /**
   * NOTE:
   * ShiftTable will attach:
   * - status
   * - openingSnapshot
   * - closingSnapshot
   */
  onCreate: (shift: Shift) => void;

  staffList: Staff[];
};

const SHIFT_LABELS = [
  "Morning",
  "Afternoon",
  "Night",
  "Full Day",
  "Custom",
];

export default function CreateShiftModal({
  open,
  onClose,
  onCreate,
  staffList,
}: Props) {
  /* ================= STATE ================= */

  const [label, setLabel] = useState("Morning");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [mode, setMode] = useState<"single" | "range">("single");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  /* ================= FILTER ACTIVE STAFF ================= */

  const activeStaff = useMemo(
    () => staffList.filter((s) => s.status === "active"),
    [staffList]
  );

  /* ================= GUARD ================= */

  if (!open) return null;

  /* ================= HELPERS ================= */

  const toggleStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!date) {
      alert("Please select a start date");
      return;
    }

    if (mode === "range" && !endDate) {
      alert("Please select an end date");
      return;
    }

    if (selectedStaff.length === 0) {
      alert("Please assign at least one staff member");
      return;
    }

    /**
     * IMPORTANT:
     * We intentionally do NOT set:
     * - status
     * - openingSnapshot
     * - closingSnapshot
     *
     * ShiftTable (Step 2) will do that.
     */
    const shift = {
      id: crypto.randomUUID(),
      label,
      startTime,
      endTime,
      startDate: date,
      endDate: mode === "range" ? endDate : undefined,
      staff: activeStaff.filter((s) =>
        selectedStaff.includes(s.id)
      ),
    } as Shift; // Safe: augmented immediately after creation

    onCreate(shift);
    onClose();

    // reset local state (nice UX)
    setLabel("Morning");
    setStartTime("08:00");
    setEndTime("16:00");
    setMode("single");
    setDate("");
    setEndDate("");
    setSelectedStaff([]);
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Shift</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Shift label */}
        <div>
          <label className="text-sm font-medium">Shift type</label>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            {SHIFT_LABELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">End time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Date mode */}
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "single"}
              onChange={() => setMode("single")}
            />
            One day
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "range"}
              onChange={() => setMode("range")}
            />
            Date range
          </label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          {mode === "range" && (
            <div>
              <label className="text-sm font-medium">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Staff selector */}
        <div>
          <label className="text-sm font-medium">Assign staff</label>
          <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
            {activeStaff.length === 0 && (
              <p className="text-sm text-gray-400">
                No active staff available
              </p>
            )}

            {activeStaff.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedStaff.includes(s.id)}
                  onChange={() => toggleStaff(s.id)}
                />
                {s.fullName} ({s.role})
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleCreate}
          className="w-full bg-[#0F766E] text-white py-3 rounded-lg font-medium hover:bg-[#0B5F58]"
        >
          Create shift
        </button>
      </div>
    </div>
  );
}
