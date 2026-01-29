"use client";

import { User, Phone, Mail, Lock } from "lucide-react";

type PersonalInfoCardProps = {
  fullName?: string;
  phone?: string;
  email?: string;
  onChange?: (field: string, value: string) => void;
};

export default function PersonalInfoCard({
  fullName = "Ade Johnson",
  phone = "0803 123 4567",
  email = "ade@restaurant.com",
  onChange,
}: PersonalInfoCardProps) {
  return (
    <section
      aria-labelledby="personal-info-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header>
        <h3
          id="personal-info-heading"
          className="font-medium text-black"
        >
          Personal information
        </h3>
        <p className="text-xs text-gray-500">
          Update your personal details and contact information
        </p>
      </header>

      {/* Form */}
      <form className="space-y-4">
        <Field
          label="Full name"
          value={fullName}
          icon={User}
          editable
          onChange={(v) => onChange?.("fullName", v)}
        />

        <Field
          label="Phone number"
          value={phone}
          icon={Phone}
          editable
          onChange={(v) => onChange?.("phone", v)}
        />

        <Field
          label="Email address"
          value={email}
          icon={Mail}
          locked
        />
      </form>

      {/* Footer note */}
      <footer className="flex items-start gap-2 text-xs text-gray-400">
        <Lock size={14} />
        <span>
          Email address cannot be changed. Contact support if you need
          to update it.
        </span>
      </footer>
    </section>
  );
}

/* =======================
   FIELD COMPONENT
======================= */

function Field({
  label,
  value,
  icon: Icon,
  editable,
  locked,
  onChange,
}: {
  label: string;
  value: string;
  icon: any;
  editable?: boolean;
  locked?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <div className="relative">
        {/* Icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>

        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={!editable || locked}
          aria-readonly={locked}
          className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm transition ${
            editable
              ? "border-gray-300 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              : "bg-gray-100 text-gray-500 border-gray-200"
          }`}
        />
      </div>
    </div>
  );
}
