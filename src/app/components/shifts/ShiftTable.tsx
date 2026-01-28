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

  const totalPages = Math.ceil(shifts.length / PAGE_SIZE);
  const current = shifts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Shifts</h3>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
        >
          Create shift
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-6 py-3">Shift</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3">Dates</th>
            <th className="px-6 py-3">Staff</th>
          </tr>
        </thead>

        <tbody>
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="border rounded-lg h-9 w-9 flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border rounded-lg h-9 w-9 flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateShiftModal
        open={open}
        onClose={() => setOpen(false)}
        staffList={STAFF}
        onCreate={(shift) => setShifts((s) => [shift, ...s])}
      />

      {viewStaff && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80 space-y-3">
            <h4 className="font-semibold">Assigned staff</h4>
            {viewStaff.map((s) => (
              <p key={s.id} className="text-sm">
                {s.fullName}
              </p>
            ))}
            <button
              onClick={() => setViewStaff(null)}
              className="w-full mt-4 border rounded-lg py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}