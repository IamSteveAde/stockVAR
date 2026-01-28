"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddStaffModal from "./AddStaffModal";

type StaffRole = "owner" | "manager" | "staff";
type StaffStatus = "active" | "invited" | "disabled";

type Staff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
};

const PAGE_SIZE = 8;

// ✅ Explicitly typed mock generator
const generateStaff = (): Staff[] =>
  Array.from({ length: 42 }).map((_, i): Staff => ({
    id: `${i + 1}`,
    fullName: `Staff Member ${i + 1}`,
    email: `staff${i + 1}@restaurant.com`,
    phone: `0803 000 00${i + 1}`,
    role:
      i === 0
        ? "owner"
        : i % 5 === 0
        ? "manager"
        : "staff",
    status: i % 4 === 0 ? "invited" : "active",
  }));

export default function StaffTable() {
  const [staff] = useState<Staff[]>(generateStaff());
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const totalStaff = staff.length;
  const totalPages = Math.ceil(totalStaff / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentStaff = staff.slice(startIndex, endIndex);
  

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold">Staff</h3>
    <p className="text-sm text-gray-500">
      Showing {startIndex + 1}–{Math.min(endIndex, totalStaff)} of{" "}
      {totalStaff} staff
    </p>
  </div>

  {/* Add Staff CTA */}
  <button
          onClick={() => setOpen(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B5F58] transition"
        >
          Add staff
        </button>

</div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentStaff.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-4 font-medium">{s.fullName}</td>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4">{s.phone}</td>
                <td className="px-6 py-4 capitalize">{s.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : s.status === "invited"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal */}
      {open && <AddStaffModal onClose={() => setOpen(false)} />}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="h-9 w-9 flex items-center justify-center rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="h-9 w-9 flex items-center justify-center rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}