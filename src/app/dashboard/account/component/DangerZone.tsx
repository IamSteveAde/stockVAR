"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Power,
  X,
} from "lucide-react";

export default function DangerZone() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");

  const CONFIRM_TEXT = "DEACTIVATE";

  const canConfirm = typed === CONFIRM_TEXT;

  return (
    <>
      <section
        aria-labelledby="danger-zone-heading"
        className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-6"
      >
        {/* Header */}
        <header>
          <h2
            id="danger-zone-heading"
            className="font-medium text-red-700"
          >
            Danger zone
          </h2>
          <p className="text-xs text-red-600">
            Irreversible and destructive actions
          </p>
        </header>

        {/* Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-red-700">
            Deactivate this business account permanently.
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Power size={16} />
            Deactivate business
          </button>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 text-xs text-red-600">
          <AlertTriangle size={14} />
          <span>
            This action cannot be undone. All users will lose access
            immediately.
          </span>
        </div>
      </section>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmOpen && (
        <ConfirmDeactivateModal
          confirmText={CONFIRM_TEXT}
          typed={typed}
          setTyped={setTyped}
          canConfirm={canConfirm}
          onCancel={() => {
            setConfirmOpen(false);
            setTyped("");
          }}
          onConfirm={() => {
            // 🔥 REAL API CALL GOES HERE
            console.log("Business deactivated");

            setConfirmOpen(false);
            setTyped("");
          }}
        />
      )}
    </>
  );
}

/* =======================
   CONFIRM MODAL
======================= */

function ConfirmDeactivateModal({
  confirmText,
  typed,
  setTyped,
  canConfirm,
  onCancel,
  onConfirm,
}: {
  confirmText: string;
  typed: string;
  setTyped: (v: string) => void;
  canConfirm: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <h4 className="font-medium">
              Deactivate business account
            </h4>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-gray-700">
          <p>
            This will permanently deactivate your business account.
            All staff members will be logged out and access will be
            revoked immediately.
          </p>

          <p className="text-red-600">
            This action cannot be undone.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Type <strong>{confirmText}</strong> to confirm
            </label>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder={confirmText}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!canConfirm}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-40"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
