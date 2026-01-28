"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateShiftModal from "./CreateShiftModal";
import { Shift, Staff } from "./types";

const PAGE_SIZE = 10;

// Mock staff
const STAFF: Staff[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `${i}`,
  fullName: `Staff ${i + 1}`,
  role: i % 5 === 0 ? "manager" : "staff",
}));

export default function ShiftTable() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [viewStaff, setViewStaff] = useState<Staff[] | null>(null);

  const totalPages = Math.max(1, Math.ceil(shifts.length / PAGE_SIZE));
  const current = shifts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shifts</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#0B5F58]"
        >
          Create shift
        </button>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden divide-y">
        {current.length === 0 && (
          <p className="p-6 text-sm text-gray-500 text-center">
            No shifts created yet
          </p>
        )}

        {current.map((s) => (
          <div key={s.id} className="p-4 space-y-2">
            <p className="font-medium">{s.label}</p>

            <p className="text-sm text-gray-600">
              {s.startTime} – {s.endTime}
            </p>

            <p className="text-xs text-gray-500">
              {s.startDate}
              {s.endDate && ` → ${s.endDate}`}
            </p>

            <button
              onClick={() => setViewStaff(s.staff)}
              className="text-sm text-[#0F766E] font-medium"
            >
              {s.staff.length} staff assigned
            </button>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Shift</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Dates</th>
              <th className="px-6 py-3">Staff</th>
            </tr>
          </thead>

          <tbody>
            {current.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No shifts created yet
                </td>
              </tr>
            )}

            {current.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-4 font-medium">{s.label}</td>
                <td className="px-6 py-4">
                  {s.startTime} – {s.endTime}
                </td>
                <td className="px-6 py-4">
                  {s.startDate}
                  {s.endDate && ` → ${s.endDate}`}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewStaff(s.staff)}
                    className="text-[#0F766E] hover:underline"
                  >
                    {s.staff.length} staff
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 md:px-6 py-4 border-t flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="h-9 w-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="h-9 w-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Create Shift Modal */}
      <CreateShiftModal
        open={open}
        onClose={() => setOpen(false)}
        staffList={STAFF}
        onCreate={(shift) => setShifts((s) => [shift, ...s])}
      />

      {/* Staff Viewer */}
      {viewStaff && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-3">
            <h4 className="font-semibold">Assigned staff</h4>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {viewStaff.map((s) => (
                <p key={s.id} className="text-sm">
                  {s.fullName}
                </p>
              ))}
            </div>

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