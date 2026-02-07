import type { AdminRestaurant } from "@/app/context/AdminContext";

export const mockAdminRestaurants: AdminRestaurant[] = [
  {
    id: "rest_001",
    name: "Red Onion Kitchen",
    city: "Lagos",
    owner: "Ade Johnson",
    ownerEmail: "ade@redonion.ng",
    staffCount: 12,
    subscriptionStatus: "active",
    createdAt: "2024-11-12T10:15:00.000Z",
    lastActivity: "2 hours ago",
    phone: "+2348031234567", // ✅ ADD
  },
  {
    id: "rest_002",
    name: "Mama Put Express",
    city: "Ibadan",
    owner: "Sola Ade",
    ownerEmail: "sola@mamaput.ng",
    staffCount: 6,
    subscriptionStatus: "trial",
    createdAt: "2025-01-03T09:00:00.000Z",
    lastActivity: "Yesterday",
    phone: "+2348031234567", // ✅ ADD
  },
];
