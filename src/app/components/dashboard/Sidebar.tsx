"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useProfile } from "../../context/ProfileContext";

import { logout } from "@/lib/logout";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Users,
  FileText,
  Settings,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  X,
} from "lucide-react";

type SidebarProps = {
  open: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const [openSettings, setOpenSettings] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();


  return (
    <>
      {/* Backdrop (mobile only) */}
      {open && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static z-40
          bg-[#0F3D3A] text-white
          w-64 min-h-screen
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo + Close */}
        <div className="px-6 py-6 flex items-center justify-between">
          <Image
            src="/images/logo/stockvarwm.svg"
            alt="StockVAR"
            width={120}
            height={32}
            priority
          />

          <button
            onClick={toggleSidebar}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 text-sm">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            active={pathname === "/dashboard"}
            onClick={toggleSidebar}
          />

          <NavItem
            icon={Package}
            label="Stock Items"
            href="/dashboard/stock"
            active={pathname.startsWith("/dashboard/stock")}
            onClick={toggleSidebar}
          />

          <NavItem
            icon={PlusCircle}
            label="New Entry"
            href="/dashboard/entry"
            active={pathname === "/dashboard/entry"}
            onClick={toggleSidebar}
          />

          <NavItem
            icon={Users}
            label="Staff"
            href="/dashboard/staff"
            active={pathname === "/dashboard/staff"}
            onClick={toggleSidebar}
          />

          <NavItem
            icon={Users}
            label="Shift"
            href="/dashboard/shift"
            active={pathname === "/dashboard/shift"}
            onClick={toggleSidebar}
          />

          <NavItem
            icon={FileText}
            label="Reports"
            href="/dashboard/reports"
            active={pathname === "/dashboard/reports"}
            onClick={toggleSidebar}
          />

          {/* Settings */}
          <button
            onClick={() => setOpenSettings((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              Settings
            </div>
            <ChevronDown
              size={16}
              className={`transition ${openSettings ? "rotate-180" : ""}`}
            />
          </button>

          {openSettings && (
            <div className="ml-8 space-y-1 text-xs text-white/80">
              <SubItem
                icon={User}
                label="Profile"
                href="/dashboard/profile"
                onClick={toggleSidebar}
              />
              <SubItem
                icon={Settings}
                label="Account Settings"
                href="/dashboard/account"
                onClick={toggleSidebar}
              />
             
              
              <SubItem
                icon={Users}
                label="Help"
                href="/dashboard/help"
                onClick={toggleSidebar}
              />
              <SubItem
  icon={LogOut}
  label="Logout"
  danger
  onClick={() => {
    // Clear mock auth/session data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    router.push("/auth/login");
  }}
/>
            </div>
          )}
        </nav>

        {/* User */}
        {/* User */}
<div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
  <Image
    src={profile.avatar}
    alt={profile.fullName}
    width={36}
    height={36}
    className="rounded-full object-cover"
  />
  <div>
    <p className="text-sm font-medium">
      {profile.fullName}
    </p>
    <p className="text-xs text-white/70">
      {profile.role}
    </p>
  </div>
</div>

      </aside>
    </>
  );
}

/* =======================
   HELPER COMPONENTS
======================= */

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  href: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
        ${
          active
            ? "bg-white/15 text-white"
            : "text-white/80 hover:bg-white/10"
        }
      `}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function SubItem({
  icon: Icon,
  label,
  href,
  onClick,
  danger,
}: {
  icon: any;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const base =
    "flex items-center gap-2 px-3 py-2 rounded-md w-full text-left transition";

  const style = danger
    ? "text-red-300 hover:bg-red-500/10"
    : "hover:bg-white/10";

  // Action item (logout)
  if (onClick && !href) {
    return (
      <button onClick={onClick} className={`${base} ${style}`}>
        <Icon size={14} />
        {label}
      </button>
    );
  }

  // Navigation item
  return (
    <Link
      href={href || "#"}
      onClick={onClick}
      className={`${base} ${style}`}
    >
      <Icon size={14} />
      {label}
    </Link>
  );
}
