"use client";

import {
  Package,
  Users,
  LogIn,
  Clock,
} from "lucide-react";

/* ================= MOCK ACTIVITY ================= */

type ActivityEvent = {
  id: number;
  type: "stock" | "shift" | "auth";
  message: string;
  time: string;
};

const DEFAULT_ACTIVITY: ActivityEvent[] = [
  {
    id: 1,
    type: "stock",
    message: "Stock variance detected for Rice",
    time: "Today • 09:14 AM",
  },
  {
    id: 2,
    type: "shift",
    message: "Morning shift assigned",
    time: "Yesterday • 6:45 PM",
  },
  {
    id: 3,
    type: "auth",
    message: "Logged in from a new device",
    time: "Today • 08:02 AM",
  },
];

/* ================= MAIN ================= */

export default function ActivityCard({
  activity = DEFAULT_ACTIVITY,
}: {
  activity?: ActivityEvent[];
}) {
  return (
    <section
      aria-labelledby="activity-heading"
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      {/* Header */}
      <header>
        <h3
          id="activity-heading"
          className="font-medium text-black"
        >
          Recent activity
        </h3>
        <p className="text-xs text-gray-500">
          A log of recent actions on your account
        </p>
      </header>

      {/* Activity list */}
      <ul className="space-y-4">
        {activity.map((event) => (
          <li
            key={event.id}
            className="flex items-start gap-3"
          >
            <ActivityIcon type={event.type} />

            <div className="flex-1">
              <p className="text-sm text-gray-700">
                {event.message}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Clock size={12} />
                {event.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ================= ICON ================= */

function ActivityIcon({
  type,
}: {
  type: "stock" | "shift" | "auth";
}) {
  const base =
    "h-8 w-8 rounded-full flex items-center justify-center shrink-0";

  if (type === "stock") {
    return (
      <span className={`${base} bg-red-100 text-red-600`}>
        <Package size={16} />
      </span>
    );
  }

  if (type === "shift") {
    return (
      <span className={`${base} bg-blue-100 text-blue-600`}>
        <Users size={16} />
      </span>
    );
  }

  return (
    <span className={`${base} bg-green-100 text-green-600`}>
      <LogIn size={16} />
    </span>
  );
}
