"use client";

import { useProfile } from "@/app/context/ProfileContext";

export default function DevProfileSwitcher() {
  const { setProfile } = useProfile();

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-xl shadow-lg p-3 space-y-2 z-50">
      <p className="text-xs font-medium text-gray-500">
        Dev Profile Switch
      </p>

      <button
        onClick={() =>
          setProfile({
            id: "staff-1",
            fullName: "John Staff",
            phone: "0801 000 0000",
            email: "staff@restaurant.com",
            role: "staff",
            avatar: "/images/avatar.png",
            status: "active",
          })
        }
        className="block w-full text-left text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        Login as Staff
      </button>

      <button
        onClick={() =>
          setProfile({
            id: "manager-1",
            fullName: "Jane Manager",
            phone: "0802 000 0000",
            email: "manager@restaurant.com",
            role: "manager",
            avatar: "/images/avatar.png",
            status: "active",
          })
        }
        className="block w-full text-left text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        Login as Manager
      </button>

      <button
        onClick={() =>
          setProfile({
            id: "owner-1",
            fullName: "Ade Johnson",
            phone: "0803 123 4567",
            email: "ade@restaurant.com",
            role: "owner",
            avatar: "/images/avatar.png",
            status: "active",
          })
        }
        className="block w-full text-left text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        Login as Owner
      </button>
    </div>
  );
}
