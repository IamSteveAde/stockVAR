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

/* ================= TEST MODE ================= */
// 🔴 SET TO false WHEN YOU ARE DONE TESTING
const TEST_MODE_FORCE_EXPIRED = true;

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

const STORAGE_KEY = "stockvar_subscription";

/* ================= PROVIDER ================= */

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  /* ================= LOAD FROM STORAGE ================= */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSubscription(JSON.parse(raw));
      }
    } catch {
      setSubscription(null);
    }
  }, []);

  /* ================= PERSIST ================= */

  const persist = (data: SubscriptionData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSubscription(data);
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

  /* ================= ACTIVATE (PAYSTACK SUCCESS) ================= */

  const activateSubscription = (amount?: number) => {
    const finalAmount = amount ?? 50000;

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

  /* ================= DERIVED STATE ================= */

  const isTrialExpired = useMemo(() => {
    // 🔥 FORCE EXPIRED FOR TESTING
    if (TEST_MODE_FORCE_EXPIRED) return true;

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
    // 🔥 HIDE COUNTDOWN IN TEST MODE
    if (TEST_MODE_FORCE_EXPIRED) return 0;

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