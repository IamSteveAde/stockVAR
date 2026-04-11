"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { type ShiftRecord } from "@/lib/api/shifts";
import { getStaffShiftsByType } from "@/lib/api/dashboard";
import { getSession } from "@/lib/api/auth";

export default function MyUpcomingShifts() {
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      const token = getSession()?.token;
      if (!token) return;
      try {
        const res = await getStaffShiftsByType(token, "upcoming", 1);
        setShifts(res.shifts || []);
      } catch (err) {
        console.error("Failed to load upcoming shifts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium text-[#0F766E] flex items-center gap-2 mb-3">
        <Calendar size={16} /> Upcoming Shifts
      </h3>

      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin text-[#0F766E]" size={20} />
        </div>
      ) : shifts.length === 0 ? (
        <p className="text-sm text-gray-400">No upcoming shifts</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {shifts.map((s) => (
            <li key={s.uid} className="border rounded-lg p-3">
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-gray-500">
                {new Date(s.date).toLocaleDateString()} • {s.startTime} – {s.endTime}
              </p>
              <p className="text-xs">
                Responsible: {s.staffResponsible || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
