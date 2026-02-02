"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Staff, Shift } from "./types";

/* ================= TYPES ================= */

type CreateShiftPayload = Omit<
  Shift,
  | "status"
  | "startedAt"
  | "endedAt"
  | "startedBy"
  | "endedBy"
  | "openingSnapshot"
  | "closingSnapshot"
>;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (shift: CreateShiftPayload) => void;
  staffList: Staff[];
  existingShifts: Shift[];
};

const SHIFT_LABELS = [
  "Morning",
  "Afternoon",
  "Night",
  "Full Day",
  "Custom",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ================= HELPERS ================= */

const isPastDate = (d: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(d);
  selected.setHours(0, 0, 0, 0);
  return selected < today;
};

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const buildTimeRange = (
  date: string,
  startTime: string,
  endTime: string
) => {
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  if (end <= start) end.setDate(end.getDate() + 1);

  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
  };
};

/* ================= COMPONENT ================= */

export default function CreateShiftModal({
  open,
  onClose,
  onCreate,
  staffList,
  existingShifts,
}: Props) {
  /* ================= STATE ================= */

  const [label, setLabel] = useState("Morning");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [date, setDate] = useState("");

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [responsibleStaffId, setResponsibleStaffId] = useState("");

  const [repeat, setRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [repeatUntil, setRepeatUntil] = useState("");

  /* ================= ACTIVE STAFF ================= */

  const activeStaff = useMemo(
    () => staffList.filter((s) => s.status === "active"),
    [staffList]
  );

  if (!open) return null;

  /* ================= STAFF TOGGLE ================= */

  const toggleStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );

    if (responsibleStaffId === id) {
      setResponsibleStaffId("");
    }
  };

  /* ================= CREATE ================= */

  const handleCreate = () => {
    if (!date) return alert("Select a start date");
    if (isPastDate(date)) return alert("Date cannot be in the past");

    if (selectedStaff.length === 0)
      return alert("Assign at least one staff");

    if (!responsibleStaffId)
      return alert("You must select the staff in charge");

    if (repeat && repeatDays.length === 0)
      return alert("Select at least one repeat day");

    const assignedStaff = activeStaff.filter((s) =>
      selectedStaff.includes(s.id)
    );

    const baseShiftId = crypto.randomUUID();
    const shiftsToCreate: CreateShiftPayload[] = [];

    const start = new Date(date);
    const end = repeatUntil ? new Date(repeatUntil) : start;

    let cursor = new Date(start);

    while (cursor <= end) {
      if (
        !repeat ||
        repeatDays.includes(cursor.getDay())
      ) {
        const d = cursor.toISOString().split("T")[0];

        const range = buildTimeRange(
          d,
          startTime,
          endTime
        );

        const conflict = existingShifts.some((s) => {
          const existing = buildTimeRange(
            s.startDate,
            s.startTime,
            s.endTime
          );
          return (
            range.startMs < existing.endMs &&
            existing.startMs < range.endMs
          );
        });

        if (conflict) {
          alert(`Shift on ${d} overlaps`);
          return;
        }

        shiftsToCreate.push({
          id: crypto.randomUUID(),
          label,
          startDate: d,
          startTime,
          endTime,
          staff: assignedStaff,
          responsibleStaffId,
          parentShiftId: repeat ? baseShiftId : undefined,
          recurrence: repeat
            ? {
                enabled: true,
                daysOfWeek: repeatDays,
                until: repeatUntil,
              }
            : undefined,
        });
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    shiftsToCreate.forEach(onCreate);
    onClose();

    /* Reset */
    setLabel("Morning");
    setStartTime("08:00");
    setEndTime("16:00");
    setDate("");
    setSelectedStaff([]);
    setResponsibleStaffId("");
    setRepeat(false);
    setRepeatDays([]);
    setRepeatUntil("");
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">
            Create Shift
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Shift type */}
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {SHIFT_LABELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>

        {/* Time */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(e.target.value)
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) =>
              setEndTime(e.target.value)
            }
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2"
        />

        {/* Repeat */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={repeat}
            onChange={(e) => setRepeat(e.target.checked)}
          />
          Repeat weekly
        </label>

        {repeat && (
          <>
            {/* 🆕 Helper description */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              This shift will repeat on selected days starting{" "}
              <strong>{formatDate(date)}</strong>{" "}
              {repeatUntil ? (
                <>
                  until <strong>{formatDate(repeatUntil)}</strong>.
                </>
              ) : (
                <>until you choose an end date.</>
              )}
            </div>

            {/* Days */}
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setRepeatDays((prev) =>
                      prev.includes(i)
                        ? prev.filter((x) => x !== i)
                        : [...prev, i]
                    )
                  }
                  className={`px-3 py-1 rounded ${
                    repeatDays.includes(i)
                      ? "bg-[#0F766E] text-white"
                      : "border"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Repeat until */}
            <input
              type="date"
              value={repeatUntil}
              onChange={(e) =>
                setRepeatUntil(e.target.value)
              }
              className="border rounded px-3 py-2"
            />
          </>
        )}

        {/* Staff */}
        <div className="border rounded p-3 space-y-2">
          {activeStaff.map((s) => (
            <label key={s.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={selectedStaff.includes(s.id)}
                onChange={() => toggleStaff(s.id)}
              />
              {s.fullName}
            </label>
          ))}
        </div>

        {/* Responsible staff */}
        <select
          value={responsibleStaffId}
          onChange={(e) =>
            setResponsibleStaffId(e.target.value)
          }
          className="border rounded px-3 py-2"
        >
          <option value="">
            Select staff in charge (required)
          </option>
          {activeStaff
            .filter((s) => selectedStaff.includes(s.id))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
        </select>

        {/* Action */}
        <button
          onClick={handleCreate}
          className="w-full bg-[#0F766E] text-white py-3 rounded"
        >
          Create shift
        </button>
      </div>
    </div>
  );
}
