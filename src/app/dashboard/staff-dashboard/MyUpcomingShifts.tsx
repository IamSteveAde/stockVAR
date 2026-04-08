"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import { Shift } from "../../components/shifts/types";

const SHIFTS_KEY = "stockvar_shifts";

export default function MyUpcomingShifts() {
  const { profile } = useProfile();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(SHIFTS_KEY);
    setShifts(raw ? JSON.parse(raw) : []);
  }, []);

  const upcoming = useMemo(
    () =>
      shifts.filter(
        (s) =>
          s.status === "planned" &&
          (s.staff.some((st) => st.fullName === profile?.fullName) ||
            s.staffResponsibleName === profile?.fullName ||
            s.responsibleStaffId === profile?.fullName)
      ),
    [shifts, profile?.fullName]
  );

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium text-[#0F766E] flex items-center gap-2 mb-3">
        <Calendar size={16} /> Upcoming Shifts
      </h3>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400">No upcoming shifts</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {upcoming.map((s) => {
            const responsible = s.staff.find(
  (st) => st.id === s.responsibleStaffId
);


            return (
              <li key={s.id} className="border rounded-lg p-3">
                <p className="font-medium">{s.label}</p>
                <p className="text-xs text-gray-500">
                  {s.startDate} • {s.startTime} – {s.endTime}
                </p>
                <p className="text-xs">
                  Responsible: {s.staffResponsibleName || responsible?.fullName}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
