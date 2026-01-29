"use client";

import ProfileHeader from "../../components/profile/ProfileHeader";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import RoleAccessCard from "../../components/profile/RoleAccessCard";
import SecurityCard from "../../components/profile/SecurityCard";
import ActivityCard from "../../components/profile/ActivityCard";
import { useProfile } from "../../context/ProfileContext";

export default function Page() {
  const { profile, updateProfile } = useProfile();

  return (
    <div className="space-y-6 max-w-5xl">
      <ProfileHeader />


      <div className="grid gap-6 md:grid-cols-2">
        <PersonalInfoCard
          profile={profile}
          onSave={updateProfile}
        />
        <RoleAccessCard />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SecurityCard />
        <ActivityCard />
      </div>
    </div>
  );
}
