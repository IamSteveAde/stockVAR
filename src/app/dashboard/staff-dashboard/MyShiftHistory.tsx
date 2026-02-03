"use client";

import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import { Shift } from "../../components/shifts/types";

const SHIFTS_KEY = "stockvar_shifts";

export default function MyShiftHistory() {
  const { profile } = useProfile();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(SHIFTS_KEY);
    setShifts(raw ? JSON.parse(raw) : []);
  }, []);

  const history = useMemo(
    () =>
      shifts
        .filter(
          (s) =>
            s.status === "ended" &&
            s.staff.some((st) => st.id === profile.id)
        )
        .slice(0, 6),
    [shifts, profile.id]
  );

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium text-[#0F766E] flex items-center gap-2 mb-3">
        <History size={16} /> Recent Shifts
      </h3>

      {history.length === 0 ? (
        <p className="text-sm text-gray-400">
          No completed shifts yet
        </p>
      ) : (
        <ul className="space-y-3 text-sm">
          {history.map((s) => (
            <li key={s.id} className="border rounded-lg p-3">
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-gray-500">
                {s.startDate} • {s.startTime} – {s.endTime}
              </p>
              <p className="text-xs">
                Role:{" "}
                {s.responsibleStaffId === profile.id
                  ? "Responsible"
                  : "Participant"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
