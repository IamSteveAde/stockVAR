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
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  /* ================= LOAD ================= */

  const load = useCallback(() => {
    const loadFromApi = async () => {
      const session = getSession();
      const token = session?.token;

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const res: any = await listAdminRestaurants(token);

        if (res && Array.isArray(res.businesses)) {
          const mapped = res.businesses.map((b: any) => ({
            id: b.uid || b.id,
            name: b.name,
            city: b.city || "Unknown",
            owner: b.owner?.name?.split("::")[0] || "Unknown",
            ownerEmail: b.owner?.email?.split("::")[0] || "No email",
            phone: b.phone || "",
            staffCount: b.staffSize || 0,
            subscriptionStatus: b.subscriptionStatus?.toLowerCase() || "expired",
            createdAt: b.createdAt || new Date().toISOString(),
          }));
          setRestaurants(mapped as AdminRestaurant[]);
          return;
        }

        setRestaurants([]);
      } catch (err: any) {
        if (err.message?.includes("401") || err.message?.includes("expired")) {
            router.push("/auth/login");
        } else {
            console.error("Admin hydrate error: ", err);
        }
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
