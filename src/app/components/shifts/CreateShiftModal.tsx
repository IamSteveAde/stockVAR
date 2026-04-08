"use client";

import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Staff, Shift } from "./types";

/* ================= TYPES ================= */

import { CreateShiftPayload } from "@/lib/api/shifts";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateShiftPayload) => Promise<void>;
  staffList: Staff[];
  existingShifts: Shift[];
};

const SHIFT_LABELS = ["Morning", "Afternoon", "Night", "Full Day", "Custom"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  return { startMs: start.getTime(), endMs: end.getTime() };
};

/* ================= COMPONENT ================= */

export default function CreateShiftModal({
  open,
  onClose,
  onCreate,
  staffList,
  existingShifts,
}: Props) {
  const [step, setStep] = useState(0);

  const [label, setLabel] = useState("Morning");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [date, setDate] = useState("");

  const [repeat, setRepeat] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [repeatUntil, setRepeatUntil] = useState("");

  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [responsibleStaffId, setResponsibleStaffId] = useState("");

  const activeStaff = useMemo(
    () => staffList.filter((s) => s.status === "active"),
    [staffList]
  );

  if (!open) return null;

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleStaff = (id: string) => {
    setSelectedStaff((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (responsibleStaffId === id) setResponsibleStaffId("");
  };

  /* ================= CREATE ================= */

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!date) return alert("Select a start date");
    if (isPastDate(date)) return alert("Date cannot be in the past");
    if (selectedStaff.length === 0) return alert("Assign at least one staff");
    if (!responsibleStaffId) return alert("Select staff in charge");
    if (repeat && repeatDays.length === 0)
      return alert("Select at least one repeat day");
    if (repeat && !repeatUntil)
      return alert("Select an end date for recurrence");

    setIsSubmitting(true);

    try {
      await onCreate({
        staffInChargeUid: responsibleStaffId,
        startDate: date,
        endDate: repeat ? repeatUntil : date,
        startTime,
        endTime,
        name: label,
        linkedStaffUids: selectedStaff,
        repeatsOn: repeat ? repeatDays.map(d => FULL_DAYS[d]) : [],
        isWeekly: repeat,
      });
      onClose();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? ((error as { message: string }).message)
          : "Unable to create shift right now.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-xl h-[92vh] sm:h-auto rounded-t-2xl sm:rounded-2xl flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Create Shift</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 py-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i <= step ? "bg-[#0F766E]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {step === 0 && (
            <>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {SHIFT_LABELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            </>
          )}

          {step === 1 && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={repeat}
                  onChange={(e) => setRepeat(e.target.checked)}
                />
                Repeat weekly
              </label>

              {repeat && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d, i) => (
                      <button
                        key={i}
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

                  <input
                    type="date"
                    value={repeatUntil}
                    onChange={(e) => setRepeatUntil(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  />

                  <p className="text-xs text-gray-500">
                    Repeats from <strong>{formatDate(date)}</strong> until{" "}
                    <strong>{formatDate(repeatUntil)}</strong>
                  </p>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
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

              <select
                value={responsibleStaffId}
                onChange={(e) => setResponsibleStaffId(e.target.value)}
                className="border rounded px-3 py-2 w-full"
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
            </>
          )}

          {step === 3 && (
            <div className="text-sm space-y-2">
              <p>
                <strong>{label}</strong> shift on{" "}
                <strong>{formatDate(date)}</strong>
              </p>
              <p>
                Time: {startTime} → {endTime}
              </p>
              <p>
                Staff:{" "}
                {activeStaff
                  .filter((s) => selectedStaff.includes(s.id))
                  .map((s) => s.fullName)
                  .join(", ")}
              </p>
              {repeat && <p>Repeats weekly</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={next}
              className="flex items-center gap-1 bg-[#0F766E] text-white px-4 py-2 rounded"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
          <button
            onClick={() => {
              void handleCreate();
            }}
            disabled={isSubmitting}
            className="flex items-center gap-1 bg-[#0F766E] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><Check size={16} /> Create shift</>
            )}
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
