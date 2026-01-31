"use client";

import {
  Shield,
  KeyRound,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useProfile } from "@/app/context/ProfileContext";
import type { UserRole } from "@/app/types/profile";

/* =======================
   ACCESS MAP (REAL LOGIC)
======================= */

function getAccessLevel(role: UserRole): string {
  switch (role) {
    case "owner":
      return "Full system access";
    case "manager":
      return "Operational access";
    case "staff":
      return "Limited access";
    default:
      return "Unknown";
  }
}

export default function RoleAccessCard() {
  const { profile } = useProfile();

  const accessLevel = getAccessLevel(profile.role);
  const isActive = profile.status === "active";

  return (
    <section
      aria-labelledby="role-access-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header>
        <h3
          id="role-access-heading"
          className="font-medium text-black"
        >
          Role & access
        </h3>
        <p className="text-xs text-gray-500">
          Your role determines what you can see and do in StockVAR
        </p>
      </header>

      {/* Info */}
      <div className="space-y-4">
        <InfoRow
          icon={Shield}
          label="Role"
          value={profile.role}
        />

        <InfoRow
          icon={KeyRound}
          label="Access level"
          value={accessLevel}
        />

        <StatusRow active={isActive} />
      </div>
    </section>
  );
}

/* =======================
   ROW COMPONENTS
======================= */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={16} />
        <span>{label}</span>
      </div>

      <span className="text-sm font-medium text-gray-900 capitalize">
        {value}
      </span>
    </div>
  );
}

function StatusRow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {active ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
        <span>Status</span>
      </div>

      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {active ? "Active" : "Suspended"}
      </span>
    </div>
  );
}