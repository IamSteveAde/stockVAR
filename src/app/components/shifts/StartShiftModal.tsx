"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Shift, Staff } from "./types";

type Props = {
  shift: Shift;
  staff: Staff[];
  onCancel: () => void;
  onConfirm: () => void;
};

export default function StartShiftModal({
  shift,
  staff,
  onCancel,
  onConfirm,
}: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  /**
   * Resolve the responsible staff member
   */
  const responsibleStaff = useMemo(
    () =>
      staff.find(
        (s) => s.id === shift.responsibleStaffId
      ),
    [staff, shift.responsibleStaffId]
  );

  const submit = () => {
    if (!responsibleStaff) {
      setError(
        "Responsible staff not found for this shift."
      );
      return;
    }

    if (!pin) {
      setError("Please enter your PIN.");
      return;
    }

    if (pin !== responsibleStaff.pin) {
      setError(
        "Invalid PIN. Only the responsible staff can start this shift."
      );
      return;
    }

    // ✅ PIN verified
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Start Shift
          </h3>
          <button onClick={onCancel}>
            <X />
          </button>
        </div>

        {/* Shift info */}
        <div className="text-sm text-gray-600">
          <p>
            <strong>Shift:</strong> {shift.label}
          </p>
          <p>
            <strong>Responsible:</strong>{" "}
            {responsibleStaff?.fullName ??
              "Unknown"}
          </p>
        </div>

        {/* PIN input */}
        <div>
          <label className="text-sm font-medium">
            Enter your PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="••••••"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
          >
            Start Shift
          </button>
        </div>
      </div>
    </div>
  );
}
