"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Pencil,
  Save,
} from "lucide-react";

type BusinessData = {
  name: string;
  type: string;
  email: string;
  phone: string;
  city: string;
  timezone: string;
};

export default function BusinessInfo() {
  // 🔹 persisted data (pretend this came from API)
  const [data, setData] = useState<BusinessData>({
    name: "Red Onion Restaurant",
    type: "Restaurant",
    email: "info@redonion.ng",
    phone: "0803 000 0000",
    city: "Lagos",
    timezone: "Africa/Lagos",
  });

  // 🔹 editable draft
  const [draft, setDraft] = useState<BusinessData>(data);

  // 🔹 edit mode
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    // ✅ here is where API call would go
    setData(draft);
    setEditing(false);
  };

  const handleEdit = () => {
    setDraft(data); // reset draft to last saved state
    setEditing(true);
  };

  return (
    <section
      aria-labelledby="business-info-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="business-info-heading"
            className="font-medium text-lg text-gray-900"
          >
            Business information
          </h2>
          <p className="text-xs text-gray-500">
            Manage your business identity and contact details
          </p>
        </div>

        {/* Action button */}
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

      {/* Form */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Business name"
          icon={Building2}
          value={draft.name}
          editable={editing}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />

        <Field
          label="Business type"
          icon={Building2}
          value={draft.type}
          editable={editing}
          onChange={(v) => setDraft({ ...draft, type: v })}
        />

        <Field
          label="Business email"
          icon={Mail}
          value={draft.email}
          editable={editing}
          onChange={(v) => setDraft({ ...draft, email: v })}
        />

        <Field
          label="Phone number"
          icon={Phone}
          value={draft.phone}
          editable={editing}
          onChange={(v) => setDraft({ ...draft, phone: v })}
        />

        <Field
          label="City"
          icon={MapPin}
          value={draft.city}
          editable={editing}
          onChange={(v) => setDraft({ ...draft, city: v })}
        />

        <Field
          label="Timezone"
          icon={Clock}
          value={draft.timezone}
          locked
        />
      </div>
    </section>
  );
}

/* =======================
   FIELD COMPONENT
======================= */

function Field({
  label,
  icon: Icon,
  value,
  editable,
  locked,
  onChange,
}: {
  label: string;
  icon: any;
  value: string;
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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>

        <input
          value={value}
          disabled={!editable || locked}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm transition ${
            locked || !editable
              ? "bg-gray-100 text-gray-500 border-gray-200"
              : "border-gray-300 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
          }`}
        />
      </div>
    </div>
  );
}
