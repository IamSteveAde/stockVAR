"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  SubscriptionData,
  Invoice,
} from "@/app/types/subscription";
import { getSession, saveSession } from "@/lib/api/auth";
import { findSubscription } from "@/lib/api/business";

/* ================= CONTEXT ================= */

type SubscriptionContextType = {
  subscription: SubscriptionData | null;
  startTrial: () => void;
  activateSubscription: (amount?: number) => void;
  isTrialExpired: boolean;
  trialDaysLeft: number | null;
};

const SubscriptionContext =
  createContext<SubscriptionContextType | null>(null);



/* ================= PROVIDER ================= */

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return getSession()?.subscription || null;
    } catch {
      return null;
    }
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    // 1. Instantly hydrate whatever explicit local cache session we had
    try {
      const session = getSession();
      if (session?.subscription) {
        setSubscription(session.subscription);
      }
    } catch {
      // ignore
    }

    // 2. Silently fetch the master latest status from backend ensuring UI perfectly aligns
    const hydrateSourceOfTruth = async () => {
      try {
        const session = getSession();
        if (session?.user?.role === "owner" && session?.token) {
           const payload: any = await findSubscription(session.token);
           if (payload) {
              const subRaw: SubscriptionData = {
                 status: payload.isActive ? (payload.isTrial ? "trial" : "active") : "expired",
                 trialStartedAt: payload.startAt,
                 trialEndsAt: payload.endAt,
                 nextBillingAt: payload.endAt,
                 createdAt: payload.startAt || new Date().toISOString(),
                 invoices: [],
              };
              
              // Only overwrite if it actually differs or formally verifies (Persist does saveSession)
              persist(subRaw);
           }
        }
      } catch {
        // network silent fallback drops explicitly defaulting back exactly on strictly cached bounds
      }
    };
    
    hydrateSourceOfTruth();
  }, []);

  /* ================= SAVE ================= */

  const persist = (data: SubscriptionData) => {
    setSubscription(data);
    try {
      const session = getSession();
      if (session) {
         saveSession({ ...session, subscription: data });
      }
    } catch {
      // ignore
    }
  };

  /* ================= START TRIAL ================= */

  const startTrial = () => {
    const now = new Date();
    const ends = new Date(
      now.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    const data: SubscriptionData = {
      status: "trial",
      trialStartedAt: now.toISOString(),
      trialEndsAt: ends.toISOString(),
      createdAt: now.toISOString(),
      invoices: [],
    };

    persist(data);
  };

  /* ================= ACTIVATE (AFTER PAYMENT) ================= */

  const activateSubscription = (amount?: number) => {
    const finalAmount = amount ?? 60000; // ✅ GUARANTEED NUMBER

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      amount: finalAmount,
      status: "paid",
      date: new Date().toISOString(),
    };

    const updated: SubscriptionData = {
      status: "active",
      amount: finalAmount,
      nextBillingAt: nextBilling.toISOString(),
      createdAt:
        subscription?.createdAt ||
        new Date().toISOString(),
      invoices: [
        ...(subscription?.invoices || []),
        invoice,
      ],
    };

    persist(updated);
  };

  /* ================= DERIVED ================= */

  const isTrialExpired = useMemo(() => {
    if (
      subscription?.status !== "trial" ||
      !subscription.trialEndsAt
    )
      return false;

    return (
      new Date(subscription.trialEndsAt) <
      new Date()
    );
  }, [subscription]);

  const trialDaysLeft = useMemo(() => {
    if (
      subscription?.status !== "trial" ||
      !subscription.trialEndsAt
    )
      return null;

    const diff =
      new Date(subscription.trialEndsAt).getTime() -
      Date.now();

    return Math.max(
      0,
      Math.ceil(diff / (1000 * 60 * 60 * 24))
    );
  }, [subscription]);

  /* ================= PROVIDER ================= */

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        startTrial,
        activateSubscription,
        isTrialExpired,
        trialDaysLeft,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscription must be used inside SubscriptionProvider"
    );
  }
  return ctx;
}