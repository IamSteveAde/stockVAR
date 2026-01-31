"use client";

import {
  Package,
  Users,
  LogIn,
  Clock,
} from "lucide-react";

/* ================= TYPES ================= */

export type ActivityType = "stock" | "shift" | "auth";

export type ActivityEvent = {
  id: number;
  type: ActivityType;
  message: string;
  time: string;
};

/* ================= DEFAULT (FALLBACK ONLY) ================= */

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

type ActivityCardProps = {
  activity?: ActivityEvent[];
};

export default function ActivityCard({
  activity,
}: ActivityCardProps) {
  const events = activity?.length
    ? activity
    : DEFAULT_ACTIVITY;

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
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-start gap-3"
          >
            <ActivityIcon type={event.type} />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 break-words">
                {event.message}
              </p>

              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Clock size={12} />
                <span>{event.time}</span>
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
  type: ActivityType;
}) {
  const base =
    "h-8 w-8 rounded-full flex items-center justify-center shrink-0";

  switch (type) {
    case "stock":
      return (
        <span className={`${base} bg-red-100 text-red-600`}>
          <Package size={16} />
        </span>
      );

    case "shift":
      return (
        <span className={`${base} bg-blue-100 text-blue-600`}>
          <Users size={16} />
        </span>
      );

    case "auth":
      return (
        <span className={`${base} bg-green-100 text-green-600`}>
          <LogIn size={16} />
        </span>
      );

    default:
      return null;
  }
}