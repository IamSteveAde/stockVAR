"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProfileData } from "../types/profile";

/* ================= TYPES ================= */

type ProfileContextType = {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
  clearProfile: () => void;
};

/* ================= CONSTANTS ================= */

const PROFILE_KEY = "stockvar_active_profile";

/* ================= HELPERS ================= */

const createDefaultProfile = (): ProfileData => ({
  id: crypto.randomUUID(),
  fullName: "Ade Johnson",
  phone: "0803 123 4567",
  email: "ade@restaurant.com",
  role: "owner",
  avatar: "/images/avatar.png",
  status: "active",
});

/* ================= CONTEXT ================= */

const ProfileContext = createContext<ProfileContextType | null>(null);

/* ================= PROVIDER ================= */

export function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfileState] = useState<ProfileData>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : createDefaultProfile();
    } catch {
      return createDefaultProfile();
    }
  });

  /* ---------- Persist on change ---------- */
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setProfile = (p: ProfileData) => {
    setProfileState(p);
  };

  const clearProfile = () => {
    const fresh = createDefaultProfile();
    setProfileState(fresh);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useProfile() {
  const ctx = useContext(ProfileContext);

  if (!ctx) {
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  }

  return ctx;
}
