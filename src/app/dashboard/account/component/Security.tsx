"use client";

import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Timer,
  LogOut,
  AlertTriangle,
  Pencil,
  Save,
  X,
} from "lucide-react";

type SecurityPolicy = {
  requirePin: boolean;
  autoLogoutHours: number;
};

export default function Security() {
  // 🔐 Persisted policy (pretend this came from backend)
  const [policy, setPolicy] = useState<SecurityPolicy>({
    requirePin: true,
    autoLogoutHours: 8,
  });

  // ✏️ Draft for editing
  const [draft, setDraft] = useState<SecurityPolicy>(policy);
  const [editing, setEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleSave = () => {
    // 🔒 API call would go here
    setPolicy(draft);
    setEditing(false);
  };

  const handleEdit = () => {
    setDraft(policy);
    setEditing(true);
  };

  return (
    <>
      <section
        aria-labelledby="security-heading"
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="security-heading"
              className="font-medium text-lg text-gray-900"
            >
              Security
            </h2>
            <p className="text-xs text-gray-500">
              PIN-based authentication and session enforcement
            </p>
          </div>

          {/* Edit / Save */}
          {editing ? (
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d645d]"
            >
              <Save size={16} />
              Save changes
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </header>

        {/* Policies */}
        <div className="space-y-4 text-sm">
          {/* PIN Requirement */}
          <PolicyRow
            icon={KeyRound}
            label="Require PIN for staff login"
            description="Each staff member must authenticate using a unique admin-issued PIN"
          >
            <input
              type="checkbox"
              checked={draft.requirePin}
              disabled={!editing}
              onChange={(e) =>
                setDraft({ ...draft, requirePin: e.target.checked })
              }
            />
          </PolicyRow>

          {/* Auto logout */}
          <PolicyRow
            icon={Timer}
            label="Automatic logout"
            description="Automatically log users out after a period of inactivity"
          >
            <select
              disabled={!editing}
              value={draft.autoLogoutHours}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  autoLogoutHours: Number(e.target.value),
                })
              }
              className="border rounded-lg px-2 py-1 text-sm disabled:bg-gray-100"
            >
              <option value={4}>4 hours</option>
              <option value={8}>8 hours</option>
              <option value={12}>12 hours</option>
            </select>
          </PolicyRow>
        </div>

        {/* Divider */}
        <hr />

        {/* Destructive actions */}
        <div className="space-y-2">
          <button
            onClick={() => setConfirmLogout(true)}
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
          >
            <LogOut size={16} />
            Logout all users
          </button>

          <p className="text-xs text-gray-400">
            This will immediately terminate all active staff sessions.
          </p>
        </div>
      </section>

      {/* ================= CONFIRM LOGOUT MODAL ================= */}
      {confirmLogout && (
        <ConfirmLogoutModal
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            console.log("All users logged out");
            setConfirmLogout(false);
          }}
        />
      )}
    </>
  );
}

/* =======================
   POLICY ROW
======================= */

function PolicyRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: any;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Icon size={18} className="text-gray-500 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* =======================
   CONFIRM MODAL
======================= */

function ConfirmLogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-5 flex items-center gap-2 border-b">
          <AlertTriangle size={18} className="text-red-600" />
          <h4 className="font-medium">Logout all users</h4>
        </div>

        <div className="p-5 text-sm text-gray-600">
          This action will immediately log out all staff members from
          the system. They will be required to log in again using their
          assigned PINs.
        </div>

        <div className="flex justify-end gap-2 p-5 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Confirm logout
          </button>
        </div>
      </div>
    </div>
  );
}
