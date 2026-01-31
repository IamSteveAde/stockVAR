"use client";

import { BusinessProvider } from "@/app/context/BusinessContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      {children}
    </BusinessProvider>
  );
}