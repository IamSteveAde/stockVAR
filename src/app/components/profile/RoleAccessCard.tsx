"use client";

import { Shield, KeyRound, CheckCircle, XCircle } from "lucide-react";

type RoleAccessCardProps = {
  role?: string;
  accessLevel?: string;
  status?: "active" | "suspended";
};

export default function RoleAccessCard({
  role = "Owner",
  accessLevel = "Full access",
  status = "active",
}: RoleAccessCardProps) {
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
          Your role determines permissions and access across the system
        </p>
      </header>

      {/* Access info */}
      <div className="space-y-4">
        <InfoRow
          icon={Shield}
          label="Role"
          value={role}
        />

        <InfoRow
          icon={KeyRound}
          label="Access level"
          value={accessLevel}
        />

        <StatusRow status={status} />
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

      <span className="text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

function StatusRow({ status }: { status: "active" | "suspended" }) {
  const isActive = status === "active";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {isActive ? (
          <CheckCircle size={16} className="text-green-600" />
        ) : (
          <XCircle size={16} className="text-red-600" />
        )}
        <span>Status</span>
      </div>

      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "Active" : "Suspended"}
      </span>
    </div>
  );
}
