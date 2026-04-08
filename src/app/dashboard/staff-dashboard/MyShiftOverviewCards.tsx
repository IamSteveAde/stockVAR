"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, CalendarCheck, UserCheck } from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import { Shift } from "../../components/shifts/types";

const SHIFTS_KEY = "stockvar_shifts";

export default function MyShiftOverviewCards() {
  const { profile } = useProfile();
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(SHIFTS_KEY);
    setShifts(raw ? JSON.parse(raw) : []);
  }, []);

  const myShifts = useMemo(
    () =>
      shifts.filter((s) =>
        s.staff.some((st) => st.fullName === profile?.fullName) ||
        s.staffResponsibleName === profile?.fullName ||
        s.responsibleStaffId === profile?.fullName
      ),
    [shifts, profile?.fullName]
  );

  const completed = myShifts.filter(
    (s) => s.status === "ended"
  ).length;

  const responsible = myShifts.filter(
    (s) => s.staffResponsibleName === profile?.fullName || s.responsibleStaffId === profile?.fullName
  ).length;

  const cards = [
    {
      label: "Assigned shifts",
      value: myShifts.length,
      icon: ClipboardList,
    },
    {
      label: "Completed shifts",
      value: completed,
      icon: CalendarCheck,
    },
    {
      label: "Responsible shifts",
      value: responsible,
      icon: UserCheck,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
            <Icon size={18} className="text-[#0F766E]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
