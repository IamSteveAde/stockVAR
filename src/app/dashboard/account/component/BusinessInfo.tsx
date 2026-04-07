"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useBusiness,
  BusinessData,
} from "@/app/context/BusinessContext";
import { getSession } from "@/lib/api/auth";
import { updateBusinessProfile } from "@/lib/api/business";

export default function BusinessInfo() {
  const { business, updateBusiness, isHydrated } = useBusiness();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<BusinessData | null>(null);

  useEffect(() => {
    if (business) setDraft(business);
  }, [business]);

  useEffect(() => {
    if (isHydrated && business && !draft) {
      setDraft(business);
    }
  }, [business, draft, isHydrated]);

  if (!draft) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-sm text-gray-500">
        Business information not set yet.
      </div>
    );
  }

  const handleSave = async () => {
    const session = getSession();
    if (!session?.token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    setSaving(true);

    try {
      const saved = await updateBusinessProfile(
        {
          name: draft.name,
          businessType: draft.type,
          location: draft.city,
          dailyStaffSize: draft.staffSize,
          staffSize: draft.staffSize,
          timezone: draft.timezone,
        },
        session.token
      );

      updateBusiness({
        id: saved.id,
        fullName: saved.fullName,
        name: saved.name,
        type: saved.type,
        email: saved.email,
        phone: saved.phone,
        city: saved.city,
        staffSize: saved.staffSize,
        timezone: saved.timezone,
        createdAt: saved.createdAt,
      });

      setDraft({
        id: saved.id,
        fullName: saved.fullName,
        name: saved.name,
        type: saved.type,
        email: saved.email,
        phone: saved.phone,
        city: saved.city,
        staffSize: saved.staffSize,
        timezone: saved.timezone,
        createdAt: saved.createdAt,
      });

      setEditing(false);
      toast.success("Business settings saved.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save business settings right now.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-start gap-4">
        <div>
          <h2 className="font-medium text-lg">
            Business information
          </h2>
          <p className="text-xs text-gray-500">
            Manage your business identity and contact
            details
          </p>
        </div>

        {editing ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#0F766E] text-white px-4 py-2 rounded-lg text-sm"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving..." : "Save"}
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}
      </header>

      {/* Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field
          label="Business name"
          icon={Building2}
          value={draft.name}
          editable={editing}
          onChange={(v) =>
            setDraft({ ...draft, name: v })
          }
        />

        <Field
          label="Business type"
          icon={Building2}
          value={draft.type}
          editable={editing}
          onChange={(v) =>
            setDraft({ ...draft, type: v })
          }
        />

        <Field
          label="Email"
          icon={Mail}
          value={draft.email ?? ""}
          editable={editing}
          onChange={(v) =>
            setDraft({ ...draft, email: v })
          }
        />

        <Field
          label="Phone"
          icon={Phone}
          value={draft.phone ?? ""}
          editable={editing}
          onChange={(v) =>
            setDraft({ ...draft, phone: v })
          }
        />

        <Field
          label="City"
          icon={MapPin}
          value={draft.city}
          editable={editing}
          onChange={(v) =>
            setDraft({ ...draft, city: v })
          }
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
   FIELD
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
      <label className="text-xs text-gray-500">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={value}
          disabled={!editable || locked}
          onChange={(e) =>
            onChange?.(e.target.value)
          }
          className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg border ${
            locked || !editable
              ? "bg-gray-100 text-gray-500 border-gray-200"
              : "border-gray-300 focus:border-[#0F766E]"
          }`}
        />
      </div>
    </div>
  );
}