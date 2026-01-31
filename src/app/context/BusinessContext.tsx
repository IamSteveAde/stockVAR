"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* =======================
   TYPES
======================= */

export type BusinessData = {
  name: string;
  type: string;
  email?: string;
  phone?: string;
  city: string;
  timezone: string;
  createdAt: string;
};

type BusinessContextType = {
  business: BusinessData | null;
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

  /* 🔹 Load persisted business on mount */
  useEffect(() => {
    const stored = localStorage.getItem(
      "stockvar_business"
    );
    if (stored) {
      try {
        setBusiness(JSON.parse(stored));
      } catch {
        localStorage.removeItem("stockvar_business");
      }
    }
  }, []);

  /* 🔹 Update business (used by onboarding + account) */
  const updateBusiness = (
    data: Partial<BusinessData>
  ) => {
    setBusiness((prev) => {
      const updated: BusinessData = {
        name: data.name ?? prev?.name ?? "",
        type: data.type ?? prev?.type ?? "",
        email: data.email ?? prev?.email,
        phone: data.phone ?? prev?.phone,
        city: data.city ?? prev?.city ?? "",
        timezone:
          data.timezone ??
          prev?.timezone ??
          "Africa/Lagos",
        createdAt:
          prev?.createdAt ??
          new Date().toISOString(),
      };

      localStorage.setItem(
        "stockvar_business",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const clearBusiness = () => {
    localStorage.removeItem("stockvar_business");
    setBusiness(null);
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
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