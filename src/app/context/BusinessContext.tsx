"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSession } from "@/lib/api/auth";
import { getMyBusinessProfile } from "@/lib/api/business";

/* =======================
  TYPES
======================= */

export type BusinessData = {
  id: string;
  fullName?: string;
  name?: string;
  type: string;
  email?: string;
  phone?: string;
  city: string;
  staffSize?: string;
  timezone: string;
  createdAt: string;
};

type BusinessContextType = {
  business: BusinessData | null;
  isHydrated: boolean;
  updateBusiness: (data: Partial<BusinessData>) => void;
  clearBusiness: () => void;
};

/* =======================
  CONTEXT
======================= */

const BusinessContext =
  createContext<BusinessContextType | null>(null);

/* =======================
  PROVIDER
======================= */

export function BusinessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, setBusiness] =
    useState<BusinessData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);



  /* 🔹 Load business profile from backend on mount */
  useEffect(() => {
    const loadBusinessProfile = async () => {
      const session = getSession();
      if (!session?.token) {
        setIsHydrated(true);
        return;
      }

      try {
        const profile = await getMyBusinessProfile(session.token);
        if (profile) {
          const nextBusiness: BusinessData = {
            id: profile.id||"me",
            fullName: profile.fullName,
            type: profile.type!,
            city: profile.location!,
            staffSize: profile.staffSize,
            timezone: profile.timezone || "Africa/Lagos",
            createdAt: profile.createdAt || new Date() .toISOString(),
          };

          setBusiness(nextBusiness);
        }
      } catch (error) {
        // Business profile doesn't exist yet or API error
        // This is OK - user just needs to onboard
      } finally {
        setIsHydrated(true);
      }
    };

    loadBusinessProfile();
  }, []);

  /* 🔹 Update business (used by onboarding) */
  const updateBusiness = (
    data: Partial<BusinessData>
  ) => {
    setBusiness((prev) => {
      const updated: BusinessData = {
        id: data.id ?? prev?.id ?? crypto.randomUUID(),
        fullName: data.fullName ?? prev?.fullName,
        name: data.name ?? prev?.name ?? "",
        type: data.type ?? prev?.type ?? "",
        email: data.email ?? prev?.email,
        phone: data.phone ?? prev?.phone,
        city: data.city ?? prev?.city ?? "",
        staffSize: data.staffSize ?? prev?.staffSize,
        timezone:
          data.timezone ??
          prev?.timezone ??
          "Africa/Lagos",
        createdAt:
          prev?.createdAt ??
          new Date().toISOString(),
      };



      return updated;
    });
  };

  const clearBusiness = () => {
    setBusiness(null);
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
        isHydrated,
        updateBusiness,
        clearBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

/* =======================
   HOOK
======================= */

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) {
    throw new Error(
      "useBusiness must be used inside BusinessProvider"
    );
  }
  return ctx;
}