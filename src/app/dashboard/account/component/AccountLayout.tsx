"use client";

import BusinessInfo from "./BusinessInfo";
import Billing from "./Billing";
import Permissions from "./Permissions";
import Security from "./Security";
import DataExport from "./DataExport";
import DangerZone from "./DangerZone";

export default function AccountLayout() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Account Settings</h1>

      <BusinessInfo />
      <Billing />
      <Permissions />
      <Security />
      <DataExport />
      <DangerZone />
    </div>
  );
}