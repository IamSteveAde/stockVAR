"use client";

import { useEffect, useState } from "react";
import { writeAuditLog } from "../../../lib/audit";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  Trash2,
} from "lucide-react";

import CreateShiftModal from "./CreateShiftModal";
import CloseShiftModal from "./CloseShiftModal";
import StartShiftModal from "./StartShiftModal";

import { Shift, Staff } from "./types";
import { useProfile } from "@/app/context/ProfileContext";
import { getSession } from "@/lib/api/auth";
import {
  createShift as createShiftApi,
  endShift as endShiftApi,
  startShift as startShiftApi,
} from "@/lib/api/shifts";

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
const formatDateWords = (dateStr: string) => {
  if (!dateStr) return "—";

  const date = new Date(dateStr);

  return date.toLocaleDateString("en-GB", {
    weekday: "short", // Tue
    day: "2-digit",   // 02
    month: "short",   // Feb
    year: "numeric",  // 2026
  }).replace(/,/g, "");
};



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
  const { profile } = useProfile();
  const canManageShifts =
    profile.role === "owner" || profile.role === "manager";

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff[] | null>(null);
  const [closingShift, setClosingShift] = useState<Shift | null>(null);
  const [startingShift, setStartingShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);

  /* ================= LOAD ================= */

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

  /* ================= START SHIFT ================= */

  const confirmStartShift = async (shift: Shift, pin: string): Promise<boolean> => {
    if (profile.role !== "staff") {
      return false;
    }

    const responsible = staff.find((s) => s.id === shift.responsibleStaffId);
    const isResponsibleById = profile.id === shift.responsibleStaffId;
    const isResponsibleByEmail =
      !!profile.email &&
      !!responsible?.email &&
      profile.email.trim().toLowerCase() === responsible.email.trim().toLowerCase();

    if (!isResponsibleById && !isResponsibleByEmail) {
      return false;
    }

    if (shifts.some((s) => s.status === "running")) {
      alert("Another shift is already running.");
      return false;
    }

    const token = getSession()?.token;
    if (!token) {
      alert("Your session has expired. Please log in again.");
      return false;
    }

    try {
      await startShiftApi(
        {
          shiftId: shift.id,
          pin,
          openingSnapshot: inventory.map((i) => ({
            sku: i.sku,
            quantity: i.quantity,
          })),
        },
        token
      );
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
          ? ((error as { message: string }).message)
          : "Unable to start shift right now.";
      alert(message);
      return false;
    }

    setShifts((prev) =>
      prev.map((s) =>
        s.id === shift.id
          ? {
            ...s,
            status: "running",
            startedAt: now(),
            startedBy: {
              staffId: profile.id,
              name: profile.fullName,
            },
            openingSnapshot: inventory.map((i) => ({
              sku: i.sku,
              quantity: i.quantity,
            })),
          }
          : s
      )
    );

    writeAuditLog({
      actor: {
        staffId: profile.id,
        name: profile.fullName,
        role: profile.role,
      },
      action: "SHIFT_START",
      description: "Shift started (PIN verified)",
      entity: {
        type: "shift",
        id: shift.id,
        name: shift.label,
      },
    });

    return true;
  };

  /* ================= END SHIFT ================= */

  const endShift = async (id: string, closingSnapshot: any[], pin: string): Promise<boolean> => {
    if (profile.role !== "staff") {
      return false;
    }

    const targetShift = shifts.find((s) => s.id === id);
    if (!targetShift) {
      return false;
    }

    const responsible = staff.find((s) => s.id === targetShift.responsibleStaffId);
    const isResponsibleById = profile.id === targetShift.responsibleStaffId;
    const isResponsibleByEmail =
      !!profile.email &&
      !!responsible?.email &&
      profile.email.trim().toLowerCase() === responsible.email.trim().toLowerCase();

    if (!isResponsibleById && !isResponsibleByEmail) {
      return false;
    }

    const token = getSession()?.token;
    if (!token) {
      alert("Your session has expired. Please log in again.");
      return false;
    }

    try {
      await endShiftApi(
        {
          shiftId: id,
          pin,
          closingSnapshot,
        },
        token
      );
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
          ? ((error as { message: string }).message)
          : "Unable to end shift right now.";
      alert(message);
      return false;
    }

    setShifts((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
            ...s,
            status: "ended",
            endedAt: now(),
            endedBy: {
              staffId: profile.id,
              name: profile.fullName,
            },
            closingSnapshot,
          }
          : s
      )
    );

    writeAuditLog({
      actor: {
        staffId: profile.id,
        name: profile.fullName,
        role: profile.role,
      },
      action: "SHIFT_END",
      description: "Shift ended (PIN verified)",
      entity: {
        type: "shift",
        id,
      },
    });

    return true;
  };

  /* ================= DELETE ================= */

  const confirmDelete = () => {
    if (!deleteShift || !canManageShifts) return;

    setShifts((prev) =>
      prev.filter((s) => s.id !== deleteShift.id)
    );

    writeAuditLog({
      actor: {
        staffId: profile.id,
        name: profile.fullName,
        role: profile.role,
      },
      action: "SHIFT_DELETE",
      description: "Shift deleted",
      entity: {
        type: "shift",
        id: deleteShift.id,
        name: deleteShift.label,
      },
    });

    setDeleteShift(null);
  };

  /* ================= SORT SHIFTS (PRIORITY ORDER) ================= */

  /* ================= SORT SHIFTS (OPERATIONAL ORDER) ================= */

  const sortedShifts = [...shifts].sort((a, b) => {
    // Status priority
    const priority = (s: Shift) =>
      s.status === "running"
        ? 0
        : s.status === "planned"
          ? 1
          : 2;

    const statusDiff = priority(a) - priority(b);
    if (statusDiff !== 0) return statusDiff;

    // Same status sorting
    if (a.status === "planned") {
      // Planned: earliest upcoming first
      const aTime = new Date(
        `${a.startDate} ${a.startTime}`
      ).getTime();
      const bTime = new Date(
        `${b.startDate} ${b.startTime}`
      ).getTime();

      return aTime - bTime;
    }

    if (a.status === "running") {
      // Running: most recently started first
      return (
        new Date(b.startedAt || 0).getTime() -
        new Date(a.startedAt || 0).getTime()
      );
    }

    // Ended: most recently ended first
    return (
      new Date(b.endedAt || 0).getTime() -
      new Date(a.endedAt || 0).getTime()
    );
  });


  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(sortedShifts.length / PAGE_SIZE)
  );

  const current = sortedShifts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );


  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#0F766E]">
          Shifts
        </h3>

        {canManageShifts && (
          <button
            onClick={() => setOpenCreate(true)}
            className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
          >
            Create shift
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Shift</th>
              <th className="px-6 py-4 text-left">
                Schedule
              </th>
              <th className="px-6 py-4 text-left">
                Timeline
              </th>
              <th className="px-6 py-4 text-left">Staff</th>
              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {current.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Shift */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {s.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateWords(s.startDate)}
                  </div>

                </td>

                {/* Schedule */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {s.startTime} – {s.endTime}
                  <div className="text-xs text-gray-400">
                    Scheduled
                  </div>
                </td>

                {/* Timeline */}
                <td className="px-6 py-4 text-xs text-gray-700 space-y-1">
                  <div>
                    <span className="text-gray-400">
                      Started:
                    </span>{" "}
                    {s.startedAt || "—"}
                  </div>
                  <div>
                    <span className="text-gray-400">
                      Ended:
                    </span>{" "}
                    {s.endedAt || "—"}
                  </div>
                </td>

                {/* Staff */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewStaff(s.staff)}
                    className="text-sm text-[#0F766E] hover:underline"
                  >
                    {s.staff.length} staff
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    {/* Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${s.status === "planned"
                          ? "bg-gray-100 text-gray-600"
                          : s.status === "running"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {s.status}
                    </span>

                    {s.status === "planned" && (
                      <>
                        <button
                          onClick={() =>
                            setStartingShift(s)
                          }
                          className="inline-flex items-center gap-1 text-xs border px-3 py-1 rounded-lg hover:bg-gray-100"
                        >
                          <Play size={12} />
                          Start
                        </button>

                        {canManageShifts && (
                          <button
                            onClick={() =>
                              setDeleteShift(s)
                            }
                            className="inline-flex items-center gap-1 text-xs border px-3 py-1 rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </>
                    )}

                    {s.status === "running" && (
                      <button
                        onClick={() =>
                          setClosingShift(s)
                        }
                        className="inline-flex items-center gap-1 text-xs border px-3 py-1 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Square size={12} />
                        End
                      </button>
                    )}
                  </div>
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
      {openCreate && (
        <CreateShiftModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          staffList={staff}
          existingShifts={shifts}
          onCreate={async (shift) => {
            const token = getSession()?.token;
            if (!token) {
              router.push("/auth/login");
              return;
            } if (!token) {
              throw new Error("Your session has expired. Please log in again.");
            }

            await createShiftApi(
              {
                label: shift.label,
                startDate: shift.startDate,
                startTime: shift.startTime,
                endTime: shift.endTime,
                responsibleStaffId: shift.responsibleStaffId,
                staffIds: shift.staff.map((member) => member.id),
                recurrence: shift.recurrence,
              },
              token
            );

            setShifts((prev) => [
              { ...shift, status: "planned" },
              ...prev,
            ]);
          }}
        />
      )}

      {startingShift && (
        <StartShiftModal
          shift={startingShift}
          staff={staff}
          currentUserId={profile.id}
          currentUserEmail={profile.email}
          currentUserRole={profile.role}
          onCancel={() => setStartingShift(null)}
          onConfirm={async (pin) => {
            const ok = await confirmStartShift(startingShift, pin);
            if (ok) {
              setStartingShift(null);
            }
            return ok;
          }}
        />
      )}

      {closingShift && (
        <CloseShiftModal
          shift={closingShift}
          inventory={inventory}
          currentUserId={profile.id}
          currentUserEmail={profile.email}
          currentUserRole={profile.role}
          onCancel={() => setClosingShift(null)}
          onConfirm={async (snapshot, pin) => {
            const ok = await endShift(closingShift.id, snapshot, pin);
            if (ok) {
              setClosingShift(null);
            }
            return ok;
          }}
        />
      )}

      {deleteShift && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <p>Delete this shift?</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setDeleteShift(null)}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewStaff && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            {viewStaff.map((s) => (
              <p key={s.id}>{s.fullName}</p>
            ))}
            <button
              onClick={() => setViewStaff(null)}
              className="mt-4 border px-4 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
