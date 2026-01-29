"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
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

/* ================= COMPONENT ================= */

export default function ShiftTable() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff[] | null>(null);
  const [closingShift, setClosingShift] = useState<Shift | null>(
    null
  );

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

  /* ================= SAVE SHIFTS ================= */

  useEffect(() => {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
  }, [shifts]);

  /* ================= START SHIFT ================= */

  const startShift = (shiftId: string) => {
    const running = shifts.find((s) => s.status === "running");
    if (running) {
      alert(`Shift "${running.label}" is already running.`);
      return;
    }

    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;

        const starter = s.staff[0];

        return {
          ...s,
          status: "running",
          startedAt: now(),
          startedBy: starter
            ? { staffId: starter.id, name: starter.fullName }
            : undefined,
          openingSnapshot: inventory.map((i) => ({
            sku: i.sku,
            quantity: i.quantity,
          })),
        };
      })
    );
  };

  /* ================= END SHIFT ================= */

  const endShift = (
    shiftId: string,
    closingSnapshot: any[]
  ) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;

        const ender = s.staff[0];

        return {
          ...s,
          status: "ended",
          endedAt: now(),
          endedBy: ender
            ? { staffId: ender.id, name: ender.fullName }
            : undefined,
          closingSnapshot,
        };
      })
    );
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
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shifts</h3>
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
        >
          Create shift
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left">Shift</th>
            <th className="px-6 py-3 text-left">Schedule</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Started</th>
            <th className="px-6 py-3 text-left">Ended</th>
            <th className="px-6 py-3 text-left">Staff</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {current.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-8 text-center text-gray-400"
              >
                No shifts created yet
              </td>
            </tr>
          )}

          {current.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-6 py-4 font-medium">
                {s.label}
              </td>

              <td className="px-6 py-4">
                {s.startTime} – {s.endTime}
              </td>

              <td className="px-6 py-4 capitalize">
                <span
                  className={`px-2 py-1 rounded text-xs ${
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

              <td className="px-6 py-4 text-xs text-gray-500">
                {s.startedAt || "—"}
              </td>

              <td className="px-6 py-4 text-xs text-gray-500">
                {s.endedAt || "—"}
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => setViewStaff(s.staff)}
                  className="text-[#0F766E]"
                >
                  {s.staff.length} staff
                </button>
              </td>

              <td className="px-6 py-4 text-right">
                {s.status === "planned" && (
                  <button
                    onClick={() => startShift(s.id)}
                    className="inline-flex items-center gap-1 text-xs text-green-700 border px-3 py-1 rounded-lg"
                  >
                    <Play size={12} /> Start shift
                  </button>
                )}

                {s.status === "running" && (
                  <button
                    onClick={() => setClosingShift(s)}
                    className="inline-flex items-center gap-1 text-xs text-red-600 border px-3 py-1 rounded-lg"
                  >
                    <Square size={12} /> End shift
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between px-6 py-4 border-t text-sm">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 w-9 border rounded-lg disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 w-9 border rounded-lg disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Create Shift Modal */}
      <CreateShiftModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        staffList={staff}
        onCreate={(shift) =>
          setShifts((prev) => [
            { ...shift, status: "planned" },
            ...prev,
          ])
        }
      />

      {/* Close Shift Modal */}
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

      {/* Staff Modal */}
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
