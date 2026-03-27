"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProfileData } from "../types/profile";
import { getSession, type AuthSession } from "@/lib/api/auth";
import { getMyProfile, updateMyProfile } from "@/lib/api/profile";

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
  const fallbackName = email.includes("@") ? email.split("@")[0] : "Owner";

  return {
    id: session?.user?.id || crypto.randomUUID(),
    fullName: session?.user?.fullName || fallbackName,
    phone: "",
    email,
    role: session?.user?.role ?? "owner",
    avatar: "/images/avatar.png",
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

    setProfileState((prev) => ({
      ...prev,
      id: session?.user?.id || prev.id,
      fullName: session?.user?.fullName || prev.fullName,
      email: session?.user?.email || prev.email,
      role: session?.user?.role ?? prev.role,
    }));

    if (!token) return;

    let mounted = true;

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
        // Local profile remains fallback if API profile fetch fails.
      });

    return () => {
      mounted = false;
    };
  }, [session?.token, session?.user?.id, session?.user?.fullName, session?.user?.email, session?.user?.role]);

  const setProfile = (p: ProfileData) => {
    setProfileState(p);

    const token = getSession()?.token;
    if (!token) return;
    updateMyProfile(p, token).catch(() => {
      // Keep local profile if remote update fails.
    });
  };

  const updateProfile = (p: Partial<ProfileData>) => {
    setProfileState((prev) => {
      const next = {
        ...prev,
        ...p,
      };

      const token = getSession()?.token;
      if (token) {
        updateMyProfile(next, token).catch(() => {
          // Keep local profile if remote update fails.
        });
      }

      return next;
    });
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
