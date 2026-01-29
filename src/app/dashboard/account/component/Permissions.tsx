"use client";

import {
  Shield,
  Crown,
  Users,
  ClipboardList,
  Lock,
} from "lucide-react";

type RolePermission = {
  role: string;
  icon: any;
  permissions: string[];
};

const DEFAULT_PERMISSIONS: RolePermission[] = [
  {
    role: "Owner",
    icon: Crown,
    permissions: [
      "Manage billing & subscription",
      "View all reports",
      "Add and remove users",
      "Change business settings",
    ],
  },
  {
    role: "Manager",
    icon: Users,
    permissions: [
      "Add staff members",
      "Assign shifts",
      "View operational reports",
    ],
  },
  {
    role: "Staff",
    icon: ClipboardList,
    permissions: [
      "Record stock in & out",
      "View assigned shifts",
    ],
  },
];

export default function Permissions({
  roles = DEFAULT_PERMISSIONS,
}: {
  roles?: RolePermission[];
}) {
  return (
    <section
      aria-labelledby="permissions-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header>
        <h2
          id="permissions-heading"
          className="font-medium text-lg text-gray-900"
        >
          Users & permissions
        </h2>
        <p className="text-xs text-gray-500">
          Role-based access control enforced across the system
        </p>
      </header>

      {/* Role matrix */}
      <div className="space-y-4">
        {roles.map((role) => (
          <RoleCard key={role.role} role={role} />
        ))}
      </div>

      {/* System note */}
      <div className="flex items-start gap-2 text-xs text-gray-400 pt-2">
        <Lock size={14} />
        <span>
          Permissions are enforced automatically and cannot be overridden
          manually.
        </span>
      </div>
    </section>
  );
}

/* =======================
   ROLE CARD
======================= */

function RoleCard({ role }: { role: RolePermission }) {
  const Icon = role.icon;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Role header */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <Icon size={16} />
        {role.role}
      </div>

      {/* Permissions */}
      <ul className="space-y-2 text-sm text-gray-600">
        {role.permissions.map((perm) => (
          <li key={perm} className="flex items-start gap-2">
            <Shield size={14} className="mt-0.5 text-gray-400" />
            <span>{perm}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
