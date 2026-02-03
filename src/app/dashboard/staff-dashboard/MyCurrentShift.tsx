"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import { Shift } from "../../components/shifts/types";

const SHIFTS_KEY = "stockvar_shifts";

export default function MyCurrentShift() {
  const { profile } = useProfile();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(SHIFTS_KEY);
    setShifts(raw ? JSON.parse(raw) : []);
  }, []);

  const currentShift = useMemo(
    () =>
      shifts.find(
        (s) =>
          s.status === "running" &&
          s.staff.some((st) => st.id === profile.id)
      ),
    [shifts, profile.id]
  );

  if (!currentShift) return null;

const responsible = currentShift.staff.find(
  (s) => s.id === currentShift.responsibleStaffId
);


  const isResponsible =
    currentShift.responsibleStaffId === profile.id;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium text-[#0F766E] flex items-center gap-2 mb-3">
        <Clock size={16} /> Current Shift
      </h3>

      <p className="font-medium">{currentShift.label}</p>
      <p className="text-sm text-gray-600">
        {currentShift.startTime} – {currentShift.endTime}
      </p>

      <p className="text-sm mt-1">
        Responsible: {responsible?.fullName ?? "Unknown"}
      </p>

      {isResponsible && (
        <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          You are responsible
        </span>
      )}
    </div>
  );
}
