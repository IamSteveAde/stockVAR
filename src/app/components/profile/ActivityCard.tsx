"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Users,
  LogIn,
  Clock,
} from "lucide-react";
import { getProfileAuditTrail } from "@/lib/api/profile";
import { getSession } from "@/lib/api/auth";
import { readAuditLogs, type AuditLog } from "@/lib/audit";

/* ================= TYPES ================= */

export type ActivityType = "stock" | "shift" | "auth";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
};

function toActivityType(log: Partial<AuditLog>): ActivityType {
  if (log.action?.startsWith("SHIFT_")) return "shift";
  if (
    log.action?.startsWith("STOCK_") ||
    log.action?.startsWith("PRODUCT_") ||
    log.action === "INVENTORY_ADJUST"
  ) {
    return "stock";
  }
  return "auth";
}

function formatAuditTime(value: string | undefined): string {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeAuditLog(raw: unknown): AuditLog | null {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Partial<AuditLog>;
  const action = candidate.action;
  const description = candidate.description;
  const createdAt = candidate.createdAt;
  const actor = candidate.actor;

  if (!action || typeof action !== "string") return null;
  if (!description || typeof description !== "string") return null;
  if (!createdAt || typeof createdAt !== "string") return null;
  if (!actor || typeof actor !== "object") return null;

  return {
    ...(candidate as AuditLog),
    id: candidate.id || crypto.randomUUID(),
  };
}

function toActivityEvent(log: AuditLog): ActivityEvent {
  return {
    id: log.id,
    type: toActivityType(log),
    message: log.description,
    time: formatAuditTime(log.createdAt),
  };
}

/* ================= MAIN ================= */

type ActivityCardProps = {
  activity?: ActivityEvent[];
};

export default function ActivityCard({
  activity,
}: ActivityCardProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(
    activity?.slice(0, 5) ?? []
  );

  useEffect(() => {
    if (activity) {
      setEvents(activity.slice(0, 5));
      return;
    }

    let mounted = true;

    const refresh = async () => {
      const session = getSession();
      const userId = session?.user?.id;
      const token = session?.token;

      const localAudit = readAuditLogs().filter((entry) => {
        if (!userId) return true;
        return entry.actor?.staffId === userId;
      });

      let backendAudit: AuditLog[] = [];
      if (token) {
        try {
          const response = await getProfileAuditTrail(token);
          if (Array.isArray(response)) {
            backendAudit = response
              .map(normalizeAuditLog)
              .filter((entry): entry is AuditLog => Boolean(entry));
          }
        } catch {
          // Local audit trail is the fallback when API audit fetch fails.
        }
      }

      const combined = [...backendAudit, ...localAudit]
        .reduce<AuditLog[]>((acc, item) => {
          if (!acc.some((x) => x.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, [])
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map(toActivityEvent);

      if (!mounted) return;
      setEvents(combined);
    };

    const refreshFromEvent = () => {
      void refresh();
    };

    const refreshOnVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    void refresh();

    window.addEventListener("audit:updated", refreshFromEvent);
    window.addEventListener("focus", refreshFromEvent);
    document.addEventListener("visibilitychange", refreshOnVisibility);

    return () => {
      mounted = false;
      window.removeEventListener("audit:updated", refreshFromEvent);
      window.removeEventListener("focus", refreshFromEvent);
      document.removeEventListener("visibilitychange", refreshOnVisibility);
    };
  }, [activity]);

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
      {events.length > 0 ? (
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
      ) : (
        <p className="text-sm text-gray-500">
          No recent audit actions yet.
        </p>
      )}
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