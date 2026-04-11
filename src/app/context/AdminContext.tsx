"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { mockAdminRestaurants } from "../../app/mocks/mockAdminRestaurants";
import { listAdminRestaurants } from "@/lib/api/admin";
import { getSession } from "@/lib/api/auth";

/* ================= TYPES ================= */

export type SubscriptionStatus =
  | "trial"
  | "active"
  | "expired"
  | "suspended";

export type AdminRestaurant = {
  id: string;
  name: string;
  city: string;
  owner: string;
  ownerEmail: string;
  phone: string;
  staffCount: number;
  subscriptionStatus: SubscriptionStatus;
  createdAt: string;
  lastActivity?: string;
};

type AdminContextType = {
  restaurants: AdminRestaurant[];
  loading: boolean;

  refresh: () => void;

  updateSubscriptionStatus: (
    restaurantId: string,
    status: SubscriptionStatus
  ) => void;
};

/* ================= CONSTANTS ================= */



const AdminContext =
  createContext<AdminContextType | null>(null);

/* ================= PROVIDER ================= */

export function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [restaurants, setRestaurants] = useState<
    AdminRestaurant[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */

  const load = useCallback(() => {
    const loadFromApi = async () => {
      const session = getSession();
      const token = session?.token;

      if (!token) {
        setRestaurants(mockAdminRestaurants);
        return;
      }

      try {
        const data = await listAdminRestaurants(token);

        if (Array.isArray(data)) {
          setRestaurants(data as AdminRestaurant[]);
          return;
        }

        setRestaurants(mockAdminRestaurants);
      } catch {
        setRestaurants(mockAdminRestaurants);
      }
    };

    loadFromApi().finally(() => {
      setLoading(false);
    });
  }, []);

  /* ================= SEED MOCK DATA (DEV SAFE) ================= */

  useEffect(() => {
    load();
  }, [load]);

  /* ================= ACTIONS ================= */

  const updateSubscriptionStatus = (
    restaurantId: string,
    status: SubscriptionStatus
  ) => {
    setRestaurants((prev) => {
      const updated = prev.map((r) =>
        r.id === restaurantId
          ? {
              ...r,
              subscriptionStatus: status,
            }
          : r
      );

      return updated;
    });
  };

  /* ================= CONTEXT VALUE ================= */

  const value: AdminContextType = {
    restaurants,
    loading,
    refresh: load,
    updateSubscriptionStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAdmin() {
  const ctx = useContext(AdminContext);

  if (!ctx) {
    throw new Error(
      "useAdmin must be used inside AdminProvider"
    );
  }

  return ctx;
}
