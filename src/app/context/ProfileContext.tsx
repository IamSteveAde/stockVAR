"use client";

import { createContext, useContext, useState } from "react";
import type { ProfileData } from "../types/profile";

/**
 * Context shape
 */
type ProfileContextType = {
  profile: ProfileData;
  updateProfile: (p: ProfileData) => void;
};

/**
 * Create context
 */
const ProfileContext = createContext<ProfileContextType | null>(null);

/**
 * Provider
 */
export function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "Ade Johnson",
    phone: "0803 123 4567",
    email: "ade@restaurant.com",

    // 🔑 IMPORTANT: roles are LOWERCASE
    role: "owner", // "owner" | "manager" | "staff"

    avatar: "/images/avatar.png",
    status: "active", // "active" | "suspended"
  });

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile: setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook
 */
export function useProfile() {
  const ctx = useContext(ProfileContext);

  if (!ctx) {
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  }

  return ctx;
}