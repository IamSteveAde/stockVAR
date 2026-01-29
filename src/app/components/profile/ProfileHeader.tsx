"use client";

import Image from "next/image";
import { Mail, ShieldCheck } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";

export default function ProfileHeader() {
  const { profile } = useProfile();

  return (
    <section
      aria-labelledby="profile-heading"
      className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
    >
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative h-20 w-20 shrink-0 rounded-full overflow-hidden">
          <Image
            key={profile.avatar} // ✅ THIS FIXES IT
            src={profile.avatar}
            alt={`${profile.fullName} profile picture`}
            fill
            className="object-cover rounded-full"
            unoptimized // ✅ IMPORTANT for data URLs
          />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h2
            id="profile-heading"
            className="text-xl font-semibold text-gray-900"
          >
            {profile.fullName}
          </h2>

          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 text-gray-600">
              <ShieldCheck size={14} />
              {profile.role}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                profile.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {profile.status === "active"
                ? "Active"
                : "Suspended"}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Mail size={14} />
            <span>{profile.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
