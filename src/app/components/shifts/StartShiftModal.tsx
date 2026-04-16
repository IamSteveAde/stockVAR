"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Shift, Staff } from "./types";

import type { UserRole } from "@/types/auth";

type Props = {
  shift: Shift;
  currentUserId: string;
  currentUserEmail: string;
  currentUserRole: UserRole;
  onCancel: () => void;
  onConfirm: (pin: string) => Promise<void>;
};

export default function StartShiftModal({
  shift,
  currentUserId,
  currentUserEmail,
  currentUserRole,
  onCancel,
  onConfirm,
}: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  /**
   * Resolve the responsible staff member
   */
  // Lookup block removed natively relying on backend name mapping string payload

  const submit = async () => {
    if (!["staff", "manager"].includes(currentUserRole)) {
      setError("Only authorized members can start shifts.");
      return;
    }

    if (!pin) {
      setError("Please enter your PIN.");
      return;
    }

    try {
      await onConfirm(pin);
    } catch (err: any) {
      setError(
        typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
          ? err.message
          : "Unable to start shift. Please try again."
      );
    }
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
            {shift.staffResponsibleName || "Unknown"}
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
            onClick={() => {
              void submit();
            }}
            className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
          >
            Start Shift
          </button>
        </div>
      </div>
    </div>
  );
}
