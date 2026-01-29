"use client";

import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Clock,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

/* ================= MAIN ================= */

export default function SecurityCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        aria-labelledby="security-heading"
        className="bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        {/* Header */}
        <header>
          <h3
            id="security-heading"
            className="font-medium text-black"
          >
            Security
          </h3>
          <p className="text-xs text-gray-500">
            Manage your password and account security
          </p>
        </header>

        {/* Password row */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <KeyRound size={16} />
              Password
            </div>
            <div className="text-xs text-gray-500">
              Last changed 2 weeks ago
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="text-sm font-medium text-[#0F766E] hover:underline"
          >
            Change password
          </button>
        </div>

        {/* Last login */}
        
      </section>

      {/* ================= MODAL ================= */}
      {open && (
        <ChangePasswordModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}

/* ================= MODAL ================= */

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const validate = () => {
    if (!current || !next || !confirm) {
      return "All fields are required.";
    }
    if (next.length < 8) {
      return "New password must be at least 8 characters.";
    }
    if (next !== confirm) {
      return "Passwords do not match.";
    }
    if (current === next) {
      return "New password must be different from current password.";
    }
    return "";
  };

  const handleSubmit = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // 🔐 Replace with real API call
    console.log("Password updated");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} />
            <h4 className="font-medium">Change password</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <PasswordField
            label="Current password"
            value={current}
            onChange={setCurrent}
            show={show}
            toggleShow={() => setShow((v) => !v)}
          />

          <PasswordField
            label="New password"
            value={next}
            onChange={setNext}
            show={show}
            toggleShow={() => setShow((v) => !v)}
            hint="Must be at least 8 characters"
          />

          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            show={show}
            toggleShow={() => setShow((v) => !v)}
          />

          {error && (
            <div className="text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-[#0F766E] text-white hover:bg-[#0d645d]"
          >
            Update password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= PASSWORD FIELD ================= */

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggleShow,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  toggleShow: () => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
        />

        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {hint && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}
