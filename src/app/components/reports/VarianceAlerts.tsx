const alerts = [
  {
    date: "12 Aug 2026",
    product: "Rice",
    variance: "-10kg",
    severity: "High",
    shift: "Night",
    staff: ["John", "Aisha", "Samuel"],
  },
];

export default function VarianceAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((a, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 space-y-2"
        >
          <div className="flex justify-between">
            <p className="font-medium">{a.product}</p>
            <span className="text-xs text-red-600">
              {a.severity}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Variance: {a.variance} • {a.date}
          </p>

          <p className="text-xs text-gray-500">
            Shift: {a.shift} • Staff: {a.staff.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}