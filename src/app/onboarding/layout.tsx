"use client";

import { BusinessProvider } from "@/app/context/BusinessContext";
import { ProfileProvider } from "@/app/context/ProfileContext";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <BusinessProvider>
        {children}
      </BusinessProvider>
    </ProfileProvider>
  );
}