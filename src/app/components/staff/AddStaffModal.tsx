"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function AddStaffModal({ onClose }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"manager" | "staff">("staff");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // MOCK submit (backend will replace this)
    setTimeout(() => {
      console.log({
        fullName,
        email,
        phone,
        role,
      });

      setLoading(false);
      onClose();
    }, 1200);
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
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g. Mary Okeke"
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="staff@restaurant.com"
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Login details & PIN will be sent here
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="0803 123 4567"
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "manager" | "staff")
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
              {loading ? "Sending invite..." : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}