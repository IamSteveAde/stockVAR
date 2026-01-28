const shifts = [
  {
    date: "12 Aug 2026",
    shift: "Night",
    staff: ["John", "Aisha", "Samuel"],
    incidents: 2,
  },
];

export default function ShiftContext() {
  return (
    <div className="space-y-4">
      {shifts.map((s, i) => (
        <div
          key={i}
          className="border rounded-lg p-4"
        >
          <p className="font-medium">
            {s.shift} Shift — {s.date}
          </p>
          <p className="text-sm text-gray-600">
            Staff: {s.staff.join(", ")}
          </p>
          <p className="text-xs text-red-600">
            {s.incidents} variance events detected
          </p>
        </div>
      ))}
    </div>
  );
}