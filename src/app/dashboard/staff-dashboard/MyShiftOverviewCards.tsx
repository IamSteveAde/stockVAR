"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CalendarCheck, UserCheck } from "lucide-react";
import { getStaffDashboardMetrics } from "@/lib/api/dashboard";
import { getSession } from "@/lib/api/auth";

export default function MyShiftOverviewCards() {
  const [metrics, setMetrics] = useState({
    all: 0,
    completed: 0,
    responsible: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = getSession()?.token;
      if (!token) return;

      try {
        const [allRes, compRes, respRes] = await Promise.all([
          getStaffDashboardMetrics(token, "all"),
          getStaffDashboardMetrics(token, "completed"),
          getStaffDashboardMetrics(token, "responsible"),
        ]);
        
        setMetrics({
          all: allRes?.count || 0,
          completed: compRes?.count || 0,
          responsible: respRes?.count || 0,
        });
      } catch (err) {
        console.error("Failed to load staff metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  const cards = [
    {
      label: "Assigned shifts",
      value: metrics.all,
      icon: ClipboardList,
    },
    {
      label: "Completed shifts",
      value: metrics.completed,
      icon: CalendarCheck,
    },
    {
      label: "Responsible shifts",
      value: metrics.responsible,
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
