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
import { useProfile } from "@/app/context/ProfileContext";
import { getSession, clearSession, isTokenExpired } from "@/lib/api/auth";
import { createStaff, listStaff } from "@/lib/api/staff";
import { useRouter, useSearchParams } from "next/navigation";

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

const loadStaff = (): Staff[] => {
  return [];
};

const saveStaff = (data: Staff[]) => {
  // Purged: Natively bounds to backend
};

/* ================= MAIN ================= */

export default function StaffTable() {
  const { profile } = useProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [page, setPage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  /* Load when page changes */
  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const token = getSession()?.token;
      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const response = await listStaff(token, page, PAGE_SIZE, undefined, search);
        if (mounted && response && response.staff) {
          const normalized: Staff[] = response.staff.map((entry: any) => ({
            id: String(entry.uid),
            fullName: String(entry.name || entry.fullName || ""),
            email: String(entry.email || ""),
            phone: String(entry.phone || ""),
            role: (entry.role?.toLowerCase() as StaffRole) || "staff",
            status: (entry.status?.toLowerCase() as StaffStatus) || "active",
            pin: typeof entry.pin === "string" && entry.pin ? entry.pin : "Sent via email",
          }));
          setStaff(normalized);
          setTotalPages(response.meta?.pageCount || 1);
          setTotalCount(response.meta?.totalCount || normalized.length);
          return;
        }
      } catch {
        // Fallback to local cache when API list fails.
      }

      if (mounted) {
        const stored = loadStaff();
        if (stored.length > 0) {
          setStaff(stored);
          setTotalCount(stored.length);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [page, search]);

  /* Persist */
  useEffect(() => {
    saveStaff(staff);
  }, [staff]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const currentStaff = staff;

  /* ================= ACTIONS ================= */

  const handleAddStaff = async (
    newStaff: { name: string; email: string; phoneNo: string; role: string }
  ) => {
    const session = getSession();
    const token = session?.token;
    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    if (isTokenExpired(token)) {
      clearSession();
      throw new Error("Your session has expired. Please log in again.");
    }

    try {
      const created = await createStaff(
        {
          name: newStaff.name,
          email: newStaff.email,
          phoneNo: newStaff.phoneNo,
          role: newStaff.role,
        },
        token
      );

      const staffMember: Staff = {
        id: String((created as any)?.uid || created?.id),
        fullName: String((created as any)?.name || created?.fullName || newStaff.name),
        email: String(created?.email || newStaff.email),
        phone: String((created as any)?.phoneNo || created?.phone || newStaff.phoneNo),
        role: (newStaff.role.toLowerCase() as StaffRole),
        status: "active",
        pin: typeof created?.pin === "string" && created.pin ? created.pin : "Sent via email",
      };

      setStaff((prev) => [staffMember, ...prev]);
      setPage(1);

      /* ===== AUDIT ===== */

    } catch (error) {
      if (
        error instanceof Error &&
        /business\s*profile\s*uid|business\s*id/i.test(error.message)
      ) {
        throw new Error("Unable to send invite right now. Please try again.");
      }

      // Handle token-related API errors
      if (
        error instanceof Error &&
        (error.message.includes("Invalid or expired token") ||
          error.message.includes("Unauthorized") ||
          error.message.includes("401"))
      ) {
        clearSession();
        throw new Error("Your session has expired. Please log in again.");
      }
      throw error;
    }
  };

  const toggleArchive = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        const newStatus =
          s.status === "archived" ? "active" : "archived";

        /* ===== AUDIT ===== */



        return {
          ...s,
          status: newStatus,
        };
      })
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
          <h3 className="text-lg font-semibold text-[#0F766E]">Staff</h3>
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + staff.length, totalCount)} of{" "}
            {totalCount}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 md:px-6 py-4 border-t">
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-900">{page}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </p>

        <div className="w-full flex justify-center">
          <div className="flex items-center gap-3">
            <button
              aria-label="Previous page"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="
        h-10 w-10 flex items-center justify-center rounded-full
        bg-[#0F766E] text-white
        hover:bg-[#0d665f]
        focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F766E]
        transition
      "
            >
              <ChevronLeft size={18} />
            </button>

            <button
              aria-label="Next page"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="
        h-10 w-10 flex items-center justify-center rounded-full
        bg-[#0F766E] text-white
        hover:bg-[#0d665f]
        focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0F766E]
        transition
      "
            >
              <ChevronRight size={18} />
            </button>
          </div>
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${status === "active"
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
