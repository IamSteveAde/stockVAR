"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  Trash2,
} from "lucide-react";
import CreateShiftModal from "./CreateShiftModal";
import CloseShiftModal from "./CloseShiftModal";
import { Shift, Staff } from "./types";

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 10;
const SHIFTS_KEY = "stockvar_shifts";
const STAFF_KEY = "stockvar_staff";
const INVENTORY_KEY = "stockvar_inventory";

/* ================= TYPES ================= */

type InventoryItem = {
  sku: string;
  quantity: number;
};

/* ================= HELPERS ================= */

const now = () => new Date().toLocaleString();

const loadStaff = (): Staff[] => {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadInventory = (): InventoryItem[] => {
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const formatDateTime = (date?: string, time?: string) => {
  if (!date || !time) return "—";
  return new Date(`${date}T${time}`).toLocaleString();
};

/* ================= COMPONENT ================= */

export default function ShiftTable() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff[] | null>(null);
  const [closingShift, setClosingShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    setStaff(loadStaff());
    setInventory(loadInventory());

    try {
      const raw = localStorage.getItem(SHIFTS_KEY);
      setShifts(raw ? JSON.parse(raw) : []);
    } catch {
      setShifts([]);
    }
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
  }, [shifts]);

  /* ================= ACTIONS ================= */

  const startShift = (id: string) => {
    if (shifts.some((s) => s.status === "running")) {
      alert("A shift is already running.");
      return;
    }

    setShifts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "running",
              startedAt: now(),
              openingSnapshot: inventory.map((i) => ({
                sku: i.sku,
                quantity: i.quantity,
              })),
            }
          : s
      )
    );
  };

  const endShift = (id: string, closingSnapshot: any[]) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "ended",
              endedAt: now(),
              closingSnapshot,
            }
          : s
      )
    );
  };

  const confirmDelete = () => {
    if (!deleteShift) return;
    setShifts((prev) =>
      prev.filter((s) => s.id !== deleteShift.id)
    );
    setDeleteShift(null);
  };

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(shifts.length / PAGE_SIZE)
  );

  const current = shifts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0F766E]">
          Shifts
        </h3>
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
        >
          Create shift
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Shift</th>
              <th className="px-6 py-3 text-left">
                Scheduled window
              </th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">
                Actual time
              </th>
              <th className="px-6 py-3 text-left">Staff</th>
              <th className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-400"
                >
                  No shifts created yet
                </td>
              </tr>
            )}

            {current.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Shift */}
                <td className="px-6 py-4 font-medium">
                  {s.label}
                </td>

                {/* Scheduled */}
                <td className="px-6 py-4 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Start:</span>{" "}
                    {formatDateTime(
                      s.startDate,
                      s.startTime
                    )}
                  </div>
                  <div>
                    <span className="font-medium">End:</span>{" "}
                    {formatDateTime(
                      s.startDate,
                      s.endTime
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.status === "planned"
                        ? "bg-gray-100 text-gray-600"
                        : s.status === "running"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                {/* Actual */}
                <td className="px-6 py-4 text-xs text-gray-600">
                  <div>
                    Started: {s.startedAt || "—"}
                  </div>
                  <div>
                    Ended: {s.endedAt || "—"}
                  </div>
                </td>

                {/* Staff */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewStaff(s.staff)}
                    className="text-[#0F766E] text-sm"
                  >
                    {s.staff.length} staff
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-2">
                  {s.status === "planned" && (
                    <>
                      <button
                        onClick={() => startShift(s.id)}
                        className="inline-flex items-center gap-1 text-xs text-green-700 border px-3 py-1 rounded-lg"
                      >
                        <Play size={12} />
                        Start
                      </button>

                      <button
                        onClick={() => setDeleteShift(s)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 border px-3 py-1 rounded-lg"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </>
                  )}

                  {s.status === "running" && (
                    <button
                      onClick={() => setClosingShift(s)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 border px-3 py-1 rounded-lg"
                    >
                      <Square size={12} />
                      End
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 border-t text-sm">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateShiftModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        staffList={staff}
        existingShifts={shifts}
        onCreate={(shift) =>
          setShifts((prev) => [
            { ...shift, status: "planned" },
            ...prev,
          ])
        }
      />

      {closingShift && (
        <CloseShiftModal
          shift={closingShift}
          inventory={inventory}
          onCancel={() => setClosingShift(null)}
          onConfirm={(snapshot) => {
            endShift(closingShift.id, snapshot);
            setClosingShift(null);
          }}
        />
      )}

      {deleteShift && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4">
            <h4 className="font-semibold text-red-600">
              Delete shift?
            </h4>
            <p className="text-sm text-gray-600">
              This will permanently delete this planned
              shift.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteShift(null)}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewStaff && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h4 className="font-semibold mb-3">
              Assigned staff
            </h4>
            {viewStaff.map((s) => (
              <p key={s.id} className="text-sm">
                {s.fullName}
              </p>
            ))}
            <button
              onClick={() => setViewStaff(null)}
              className="w-full mt-4 border rounded-lg py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
