"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import { getSession } from "@/lib/api/auth";
import { type ShiftRecord, listShifts } from "@/lib/api/shifts";

export default function MyCurrentShift() {
  const [currentShift, setCurrentShift] = useState<ShiftRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrent = async () => {
      const token = getSession()?.token;
      if (!token) return;
      try {
        const res = await listShifts(token, 1, 1, "Running");
        if (res.shifts && res.shifts.length > 0) {
          setCurrentShift(res.shifts[0]);
        }
      } catch (err) {
        console.error("Failed to load current shift", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrent();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-center min-h-[100px]">
        <Loader2 className="animate-spin text-[#0F766E]" size={20} />
      </div>
    );
  }

  if (!currentShift) return null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-medium text-[#0F766E] flex items-center gap-2 mb-3">
        <Clock size={16} /> Current Shift
      </h3>

      <p className="font-medium">{currentShift.name}</p>
      <p className="text-sm text-gray-600">
        {currentShift.startTime} – {currentShift.endTime}
      </p>

      <p className="text-sm mt-1">
        Responsible: {currentShift.shiftManager || "Unknown"}
      </p>
    </div>
  );
}
