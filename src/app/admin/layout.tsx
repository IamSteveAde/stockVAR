"use client";

import { AdminProvider, useAdmin } from "@/app/context/AdminContext";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminTopbar from "@/app/components/admin/AdminTopbar";

/* ================= INTERNAL SHELL ================= */

function AdminShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-sm text-gray-500">
        Loading admin console…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        {/* Content wrapper */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= LAYOUT ================= */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
