"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProfileData } from "../types/profile";
import { getSession, type AuthSession } from "@/lib/api/auth";
import { getMyProfile } from "@/lib/api/profile";
import { readSignupName } from "@/lib/onboarding";

/* ================= TYPES ================= */

type ProfileContextType = {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;               // replace user
  updateProfile: (p: Partial<ProfileData>) => void;  // mutate user
  clearProfile: () => void;
};

/* ================= CONSTANTS ================= */

const PROFILE_KEY_PREFIX = "stockvar_profile";

/* ================= HELPERS ================= */

function resolveProfileKey(session: AuthSession | null): string {
  const userId = session?.user?.id?.trim();
  if (userId) return `${PROFILE_KEY_PREFIX}:${userId}`;

  const email = session?.user?.email?.trim().toLowerCase();
  if (email) return `${PROFILE_KEY_PREFIX}:${email}`;

  return `${PROFILE_KEY_PREFIX}:anonymous`;
}

function createDefaultProfile(session: AuthSession | null): ProfileData {
  const email = session?.user?.email ?? "";
  const signupName = readSignupName();
  let fullName = session?.user?.fullName?.trim() || signupName.trim() || "";
  if (!fullName) {
    fullName = "Business Owner";
  }

  return {
    
    fullName,
    phoneNumber: "",
    email,
    role: session?.user?.role ?? "owner",
    profileUrl: "/images/avatar.png",
    status: "active",
  };
}


/* ================= CONTEXT ================= */

const ProfileContext = createContext<ProfileContextType | null>(null);

/* ================= PROVIDER ================= */

export function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getSession();
  const profileKey = resolveProfileKey(session);

  const [profile, setProfileState] = useState<ProfileData>(() => {
    try {
      const raw = localStorage.getItem(profileKey);
      return raw ? JSON.parse(raw) : createDefaultProfile(session);
    } catch {
      return createDefaultProfile(session);
    }
  });

  /* Persist profile */
  useEffect(() => {
    localStorage.setItem(profileKey, JSON.stringify(profile));
  }, [profile, profileKey]);

  useEffect(() => {
    const token = session?.token;

    // Update profile state with session user data
    setProfileState((prev) => ({
      ...prev,
      
      fullName: session?.user?.fullName || prev.fullName,
      email: session?.user?.email || prev.email,
      role: session?.user?.role ?? prev.role,
    }));

    if (!token) return;

    let mounted = true;

    // Load profile from backend (read-only)
    getMyProfile(token)
      .then((apiProfile) => {
        if (!mounted) return;
        if (!apiProfile || typeof apiProfile !== "object") return;

        setProfileState((prev) => ({
          ...prev,
          ...apiProfile,
          role: (apiProfile.role as ProfileData["role"]) ?? prev.role,
        }));
      })
      .catch(() => {
        // Local profile remains as fallback if API load fails.
        // Do NOT attempt to create profile here.
        // User profile will be created when needed (e.g., on settings page).
      });

    return () => {
      mounted = false;
    };
  }, [session?.token, session?.user?.id, session?.user?.fullName, session?.user?.email, session?.user?.role]);

  const setProfile = (p: ProfileData) => {
    setProfileState(p);
  };

  const updateProfile = (p: Partial<ProfileData>) => {
    setProfileState((prev) => ({
      ...prev,
      ...p,
    }));
  };

  const clearProfile = () => {
    localStorage.removeItem(profileKey);
    setProfileState(createDefaultProfile(getSession()));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
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
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return ctx;
}
