"use client";

import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { ProfileProvider } from "../context/ProfileContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProfileProvider>
      {/* 🔒 Lock horizontal overflow at the root */}
      <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar toggleSidebar={() => setSidebarOpen(true)} />

          {/* 🔑 THIS IS CRITICAL */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
}
