"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import OverviewCards from "./OverviewCards";
import VarStatus from "./VarStatus";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      {/* Sidebar */}
      <div className={`fixed lg:static z-40 ${open ? "block" : "hidden"} lg:block`}>
        
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
       

        <main className="p-4 md:grid-cols-2 gap-6">
          <OverviewCards />

          <div className="grid lg:grid-cols-2 gap-6">
            <VarStatus />
            <RecentActivity />
          </div>
          <QuickActions />
        </main>
      </div>
    </div>
  );
}
