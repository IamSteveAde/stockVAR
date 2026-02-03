"use client";

import MyShiftOverviewCards from "./MyShiftOverviewCards";
import MyCurrentShift from "./MyCurrentShift";
import MyUpcomingShifts from "./MyUpcomingShifts";
import MyShiftHistory from "./MyShiftHistory";

export default function StaffDashboardLayout() {
  return (
    <main className="p-4 space-y-6">
      <MyShiftOverviewCards />

      <MyCurrentShift />

      <div className="grid lg:grid-cols-2 gap-6">
        <MyUpcomingShifts />
        <MyShiftHistory />
      </div>
    </main>
  );
}
