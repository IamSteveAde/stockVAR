"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Archive,
  Trash2,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import AddStaffModal from "./AddStaffModal";

/* ================= TYPES ================= */

type StaffRole = "owner" | "manager" | "staff";
type StaffStatus = "active" | "invited" | "archived";

type Staff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  pin: string;
};

const PAGE_SIZE = 8;

/* ================= MOCK DATA ================= */

const generatePin = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

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
    status: i % 7 === 0 ? "invited" : "active",
    pin: generatePin(),
  }));

/* ================= MAIN ================= */

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>(generateStaff());
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const totalPages = Math.ceil(staff.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  // inside StaffTable component

const handleAddStaff = (newStaff: Staff) => {
  setStaff((prev) => [newStaff, ...prev]);
  setPage(1); // jump back to first page
};

  const currentStaff = staff.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  /* ================= ACTIONS ================= */

  const toggleArchive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "archived"
                  ? "active"
                  : "archived",
            }
          : s
      )
    );
    setOpenMenu(null);
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    setOpenMenu(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-4 md:px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Staff</h3>
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, staff.length)} of{" "}
            {staff.length}
          </p>
        </div>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B5F58]"
        >
          Add staff
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Login PIN</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentStaff.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {s.fullName}
                </td>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4 capitalize">
                  {s.role}
                </td>

                {/* PIN */}
                <td className="px-6 py-4 font-mono">
                  <div className="inline-flex items-center gap-2">
                    <KeyRound size={14} />
                    {s.pin}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={s.status} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === s.id ? null : s.id
                      )
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenu === s.id && (
                    <div className="absolute right-6 top-12 z-10 w-44 rounded-lg border bg-white shadow-lg text-sm">
                      <button
                        onClick={() => toggleArchive(s.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-50"
                      >
                        {s.status === "archived" ? (
                          <>
                            <RotateCcw size={14} />
                            Unarchive
                          </>
                        ) : (
                          <>
                            <Archive size={14} />
                            Archive
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => deleteStaff(s.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="block md:hidden divide-y">
        {currentStaff.map((s) => (
          <div key={s.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{s.fullName}</span>
              <StatusBadge status={s.status} />
            </div>

            <div className="text-sm text-gray-600">
              {s.email}
            </div>

            <div className="flex items-center gap-2 text-sm font-mono">
              <KeyRound size={14} />
              {s.pin}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => toggleArchive(s.id)}
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                {s.status === "archived"
                  ? "Unarchive"
                  : "Archive"}
              </button>
              <button
                onClick={() => deleteStaff(s.id)}
                className="flex-1 border rounded-lg py-2 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

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

      {openAdd && (
  <AddStaffModal
    onClose={() => setOpenAdd(false)}
    onAddStaff={handleAddStaff}
  />
)}

    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: StaffStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
        status === "active"
          ? "bg-green-100 text-green-700"
          : status === "invited"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
