"use client";

import Image from "next/image";
import { Mail, ShieldCheck, Pencil } from "lucide-react";

/* ================= TYPES ================= */

type ProfileHeaderProps = {
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  status?: "active" | "suspended";
  onEdit?: () => void;
};

/* ================= COMPONENT ================= */

export default function ProfileHeader({
  name = "Ade Johnson",
  email = "ade@restaurant.com",
  role = "Owner",
  avatarUrl = "/images/avatar.png",
  status = "active",
  onEdit,
}: ProfileHeaderProps) {
  return (
    <section
      aria-labelledby="profile-heading"
      className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
    >
      {/* ================= IDENTITY ================= */}
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative h-20 w-20 shrink-0">
          <Image
            src={avatarUrl}
            alt={`${name} profile picture`}
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>

        {/* Core identity */}
        <div className="space-y-1">
          <h2
            id="profile-heading"
            className="text-xl font-semibold text-gray-900"
          >
            {name}
          </h2>

          {/* Role + Status */}
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gray-600">
              <ShieldCheck size={14} />
              {role}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "active" ? "Active" : "Suspended"}
            </span>
          </div>

          {/* Contact */}
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Mail size={14} />
            <span>{email}</span>
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
        >
          <Pencil size={14} />
          Edit profile
        </button>
      </div>
    </section>
  );
}
