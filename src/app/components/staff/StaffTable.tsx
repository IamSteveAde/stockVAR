"use client";

import { useEffect, useState } from "react";
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

export type StaffRole = "owner" | "manager" | "staff";
export type StaffStatus = "active" | "invited" | "archived";

export type Staff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  pin: string;
};

/* ================= CONSTANTS ================= */

const PAGE_SIZE = 8;
const STAFF_KEY = "stockvar_staff";

/* ================= HELPERS ================= */

const generatePin = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const loadStaff = (): Staff[] => {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStaff = (data: Staff[]) => {
  localStorage.setItem(STAFF_KEY, JSON.stringify(data));
};

/* ================= MAIN ================= */

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  /* Load once */
  useEffect(() => {
    const stored = loadStaff();

    if (stored.length === 0) {
      const owner: Staff = {
        id: crypto.randomUUID(),
        fullName: "Business Owner",
        email: "owner@business.com",
        phone: "0800 000 0000",
        role: "owner",
        status: "active",
        pin: generatePin(),
      };
      saveStaff([owner]);
      setStaff([owner]);
    } else {
      setStaff(stored);
    }
  }, []);

  /* Persist */
  useEffect(() => {
    saveStaff(staff);
  }, [staff]);

  const totalPages = Math.max(1, Math.ceil(staff.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;

  const currentStaff = staff.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  /* ================= ACTIONS ================= */

  const handleAddStaff = (
    newStaff: Omit<Staff, "id" | "pin" | "status">
  ) => {
    const staffMember: Staff = {
      ...newStaff,
      id: crypto.randomUUID(),
      status: "active",
      pin: generatePin(),
    };

    setStaff((prev) => [staffMember, ...prev]);
    setPage(1);
  };

  const toggleArchive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "archived" ? "active" : "archived",
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
      <div className="px-4 md:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
        >
          Add staff
        </button>
      </div>

      {/* ================= MOBILE & TABLET (CARDS) ================= */}
      <div className="md:hidden divide-y">
        {currentStaff.map((s) => (
          <div key={s.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{s.fullName}</p>
                <p className="text-xs text-gray-500">{s.email}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>

            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
              <span>
                <strong>Role:</strong> {s.role}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <KeyRound size={12} /> {s.pin}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => toggleArchive(s.id)}
                className="flex-1 inline-flex items-center justify-center gap-1 border rounded-lg py-2 text-xs"
              >
                {s.status === "archived" ? (
                  <>
                    <RotateCcw size={12} /> Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={12} /> Archive
                  </>
                )}
              </button>

              <button
                onClick={() => deleteStaff(s.id)}
                className="flex-1 inline-flex items-center justify-center gap-1 border rounded-lg py-2 text-xs text-red-600"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
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
                <td className="px-6 py-4 capitalize">{s.role}</td>

                <td className="px-6 py-4 font-mono flex items-center gap-2">
                  <KeyRound size={14} />
                  {s.pin}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={s.status} />
                </td>

                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === s.id ? null : s.id)
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
                            <RotateCcw size={14} /> Unarchive
                          </>
                        ) : (
                          <>
                            <Archive size={14} /> Archive
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => deleteStaff(s.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Add Staff Modal */}
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
