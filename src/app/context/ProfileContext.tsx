"use client";

import { createContext, useContext, useState } from "react";
import type { ProfileData } from "../types/profile";

type ProfileContextType = {
  profile: ProfileData;
  updateProfile: (p: ProfileData) => void;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: "Ade Johnson",
    phone: "0803 123 4567",
    email: "ade@restaurant.com",
    role: "Owner",
    avatar: "/images/avatar.png",
    status: "active",
  });

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile: setProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );
  return ctx;
}
