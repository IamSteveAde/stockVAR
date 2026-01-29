"use client";

import { useState } from "react";
import { X } from "lucide-react";

/* ================= TYPES ================= */

type StaffRole = "manager" | "staff";

type NewStaff = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: "invited";
  pin: string;
};

type Props = {
  onClose: () => void;
  onAddStaff: (staff: NewStaff) => void;
};

/* ================= HELPERS ================= */

const generatePin = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= COMPONENT ================= */

export default function AddStaffModal({
  onClose,
  onAddStaff,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // simulate backend
    setTimeout(() => {
      const newStaff: NewStaff = {
        id: crypto.randomUUID(),
        fullName,
        email,
        phone,
        role,
        status: "invited",
        pin: generatePin(),
      };

      onAddStaff(newStaff);
      setLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add staff member</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5"
        >
          <Input
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="e.g. Mary Okeke"
          />

          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="staff@restaurant.com"
            helper="Login PIN will be sent here"
          />

          <Input
            label="Phone number"
            value={phone}
            onChange={setPhone}
            placeholder="0803 123 4567"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as StaffRole)
              }
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-[#0F766E] text-white hover:bg-[#0B5F58] disabled:opacity-60"
            >
              {loading ? "Sending invite…" : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  helper,
  type = "text",
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
      />
      {helper && (
        <p className="mt-1 text-xs text-gray-500">{helper}</p>
      )}
    </div>
  );
}
