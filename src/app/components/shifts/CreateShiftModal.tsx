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

const SHIFT_LABELS = ["Morning", "Afternoon", "Night", "Full Day", "Custom"];
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

const buildTimeRange = (date: string, startTime: string, endTime: string) => {
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
  const [label, setLabel] = useState("Morning");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [date, setDate] = useState("");

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [responsibleStaffId, setResponsibleStaffId] = useState("");

  const [repeat, setRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [repeatUntil, setRepeatUntil] = useState("");

  const activeStaff = useMemo(
    () => staffList.filter((s) => s.status === "active"),
    [staffList]
  );

  if (!open) return null;

  const toggleStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    if (responsibleStaffId === id) setResponsibleStaffId("");
  };

  const handleCreate = () => {
    if (!date) return alert("Select a start date");
    if (isPastDate(date)) return alert("Date cannot be in the past");
    if (!selectedStaff.length) return alert("Assign at least one staff");
    if (!responsibleStaffId)
      return alert("You must select the staff in charge");
    if (repeat && !repeatDays.length)
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
      if (!repeat || repeatDays.includes(cursor.getDay())) {
        const d = cursor.toISOString().split("T")[0];
        const range = buildTimeRange(d, startTime, endTime);

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
            ? { enabled: true, daysOfWeek: repeatDays, until: repeatUntil }
            : undefined,
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    shiftsToCreate.forEach(onCreate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-xl md:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create Shift</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Shift type */}
          <div>
            <label className="text-sm font-medium">Shift type</label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-3"
            >
              {SHIFT_LABELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium">Start date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Repeat */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">Repeat weekly</span>
          </div>

          {repeat && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-600">
                Repeats from <strong>{formatDate(date)}</strong>{" "}
                {repeatUntil && (
                  <>
                    until <strong>{formatDate(repeatUntil)}</strong>
                  </>
                )}
              </p>

              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-2 rounded-full text-sm ${
                      repeatDays.includes(i)
                        ? "bg-[#0F766E] text-white"
                        : "border bg-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <input
                type="date"
                value={repeatUntil}
                onChange={(e) => setRepeatUntil(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          )}

          {/* Staff */}
          <div>
            <label className="text-sm font-medium">Assign staff</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded-xl p-4">
              {activeStaff.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(s.id)}
                    onChange={() => toggleStaff(s.id)}
                  />
                  {s.fullName}
                </label>
              ))}
            </div>
          </div>

          {/* Responsible staff */}
          <div>
            <label className="text-sm font-medium">
              Staff in charge
            </label>
            <select
              value={responsibleStaffId}
              onChange={(e) => setResponsibleStaffId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-4 py-3"
            >
              <option value="">Select staff in charge</option>
              {activeStaff
                .filter((s) => selectedStaff.includes(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}
                  </option>
                ))}
            </select>
          </div>

          {/* Action */}
          <button
            onClick={handleCreate}
            className="w-full bg-[#0F766E] hover:bg-[#115e59] transition text-white py-4 rounded-xl font-medium"
          >
            Create shift
          </button>
        </div>
      </div>
    </div>
  );
}
