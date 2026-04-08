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
  listShifts,
} from "@/lib/api/shifts";
import { useRouter } from "next/navigation";





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
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [openCreate, setOpenCreate] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff[] | null>(null);
  const [closingShift, setClosingShift] = useState<Shift | null>(null);
  const [startingShift, setStartingShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    let mounted = true;
    setStaff(loadStaff());
    setInventory(loadInventory());

    const hydrate = async () => {
      const token = getSession()?.token;
      if (!token) return;

      try {
        const response: any = await listShifts(token, page, PAGE_SIZE);
        if (mounted && response && response.shifts) {
          const mapped = response.shifts.map((s: any) => ({
            id: s.uid || s.id,
            label: s.name || s.label,
            startDate: s.date || s.startDate,
            startTime: s.startTime,
            endTime: s.endTime,
            staff: Array(s.staffCount || 1).fill({ id: "dummy", fullName: "Staff Member" }),
            status: s.status?.toLowerCase() === "ended" ? "ended" : (s.clockInTime && !s.clockOutTime) ? "running" : "planned",
            startedAt: s.clockInTime,
            endedAt: s.clockOutTime,
            responsibleStaffId: s.responsibleStaffId || s.id,
            staffResponsibleName: s.staffResponsible,
          }));
          setShifts(mapped);
          setTotalPages(response.meta?.pageCount || 1);
          setTotalCount(response.meta?.totalCount || mapped.length);
        }
      } catch (err) {}
    };

    hydrate();
    return () => { mounted = false; };
  }, [page, refreshKey]);

  /* ================= START SHIFT ================= */

  const confirmStartShift = async (shift: Shift, pin: string): Promise<void> => {
    if (!["staff", "manager"].includes(profile.role)) {
      throw new Error("Only authorized members can start shifts.");
    }

    if (shifts.some((s) => s.status === "running")) {
      throw new Error("Another shift is already running.");
    }

    const token = getSession()?.token;
    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    await startShiftApi(
      {
        shiftUid: shift.id,
        pin,
      },
      token
    );

    // Trigger standard API re-fetch instead of local payload mutation
    setRefreshKey((k) => k + 1);
  };


  /* ================= END SHIFT ================= */

  const endShift = async (id: string, closingSnapshot: any[], pin: string): Promise<void> => {
    if (!["staff", "manager"].includes(profile.role)) {
      throw new Error("Only authorized members can end shifts.");
    }

    const targetShift = shifts.find((s) => s.id === id);
    if (!targetShift) {
      throw new Error("Shift could not be found locally.");
    }

    const token = getSession()?.token;
    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    await endShiftApi(
      {
        shiftId: id,
        pin,
        closingSnapshot,
      },
      token
    );

    setRefreshKey((k) => k + 1);
  };


  /* ================= DELETE ================= */

  const confirmDelete = () => {
    if (!deleteShift || !canManageShifts) return;

    setShifts((prev) =>
      prev.filter((s) => s.id !== deleteShift.id)
    );

    // writeAuditLog({
    //   actor: {
    //     staffId: profile.id,
    //     name: profile.fullName,
    //     role: profile.role,
    //   },
    //   action: "SHIFT_DELETE",
    //   description: "Shift deleted",
    //   entity: {
    //     type: "shift",
    //     id: deleteShift.id,
    //     name: deleteShift.label,
    //   },
    // });

    setDeleteShift(null);
  };

  /* ================= SORT SHIFTS (PRIORITY ORDER) ================= */

  /* ================= PAGINATION ================= */

  const current = shifts;


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
          onCreate={async (payload) => {
            const token = getSession()?.token;
            if (!token) {
              throw new Error("Your session has expired. Please log in again.");
            }

            await createShiftApi(payload, token);

            // Fetch natively from the backend rather than pushing dummy maps
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {startingShift && (
        <StartShiftModal
          shift={startingShift}
          staff={staff}
          // currentUserId={profile.id}
          currentUserId="dummy"
          currentUserEmail={profile.email}
          currentUserRole={profile.role}
          onCancel={() => setStartingShift(null)}
          onConfirm={async (pin) => {
            await confirmStartShift(startingShift, pin);
            setStartingShift(null);
          }}
        />
      )}

      {closingShift && (
        <CloseShiftModal
          shift={closingShift}
          inventory={inventory}
          // currentUserId={profile.id}
          currentUserId="dummy"
          currentUserEmail={profile.email}
          currentUserRole={profile.role}
          onCancel={() => setClosingShift(null)}
          onConfirm={async (snapshot, pin) => {
            await endShift(closingShift.id, snapshot, pin);
            setClosingShift(null);
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
