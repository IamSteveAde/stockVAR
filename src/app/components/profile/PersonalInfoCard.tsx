"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  Mail,
  Lock,
  Camera,
  Save,
  Pencil,
  X,
} from "lucide-react";

import type { ProfileData } from "../../types/profile";

type Props = {
  profile: ProfileData;
  onSave: (p: ProfileData) => void;
};

export default function PersonalInfoCard({
  profile,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [editing, setEditing] = useState(false);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
  };

  const saveChanges = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleAvatarUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDraft({
        ...draft,
        avatar: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-medium text-black">
            Personal information
          </h3>
          <p className="text-xs text-gray-500">
            Update your profile details
          </p>
        </div>

        {!editing ? (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            <Pencil size={16} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm text-white hover:bg-[#0B5F58]"
            >
              <Save size={16} />
              Save changes
            </button>
          </div>
        )}
      </header>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border">
          <Image
            src={draft.avatar}
            alt="Profile avatar"
            fill
            className="object-cover"
          />
        </div>

        {editing && (
          <label className="cursor-pointer text-sm text-[#0F766E] font-medium">
            <Camera size={16} className="inline mr-1" />
            Change photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>
        )}
      </div>

      {/* Fields */}
      <Field
        label="Full name"
        value={draft.fullName}
        icon={User}
        editable={editing}
        onChange={(v) =>
          setDraft({ ...draft, fullName: v })
        }
      />

      <Field
        label="Phone number"
        value={draft.phone}
        icon={Phone}
        editable={editing}
        onChange={(v) =>
          setDraft({ ...draft, phone: v })
        }
      />

      <Field
        label="Email address"
        value={draft.email}
        icon={Mail}
        locked
      />

      <footer className="flex items-start gap-2 text-xs text-gray-400">
        <Lock size={14} />
        Email address cannot be changed
      </footer>
    </section>
  );
}

/* ================= FIELD ================= */

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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={16} />
        </span>

        <input
          value={value}
          disabled={!editable || locked}
          onChange={(e) => onChange?.(e.target.value)}
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
