"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/api/auth";
import { getMyProfile } from "@/lib/api/profile";
import { getMyBusinessProfile } from "@/lib/api/business";

export default function DebugProfileLoader() {
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const checkData = async () => {
      const session = getSession();
      console.log("=== DEBUG SESSION ===", session);

      if (session?.token) {
        try {
          const profile = await getMyProfile(session.token);
          console.log("=== DEBUG PROFILE ===", profile);

          const business = await getMyBusinessProfile(session.token);
          console.log("=== DEBUG BUSINESS ===", business);

          setDebug({
            sessionUserId: session.user?.id,
            sessionUserEmail: session.user?.email,
            profileId: profile?.id,
            profileEmail: profile?.email,
            businessId: business?.id,
            businessName: business?.name,
            match: session.user?.id === profile?.id,
          });
        } catch (error) {
          console.error("=== DEBUG ERROR ===", error);
          setDebug({ error: String(error) });
        }
      }
    };

    checkData();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg max-w-sm text-xs font-mono overflow-auto max-h-96 z-50 border-2 border-red-500">
      <div className="font-bold mb-2 text-red-300">🔍 DEBUG: User Mismatch?</div>
      <pre className="text-xs">{JSON.stringify(debug, null, 2)}</pre>
    </div>
  );
}
