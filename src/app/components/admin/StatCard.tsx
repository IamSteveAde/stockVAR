export default function StatCard({
  label,
  value,
  variant = "default",
  helper,
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "danger";
  helper?: string;
}) {
  const variantStyles = {
    default: "",
    success: "text-green-600",
    danger: "text-red-600",
  };

  const borderStyles = {
    default: "",
    success: "border border-green-200",
    danger: "border border-red-200",
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm ${
        borderStyles[variant]
      }`}
    >
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p
        className={`text-2xl font-semibold ${
          variantStyles[variant]
        }`}
      >
        {value}
      </p>

      {helper && (
        <p className="mt-1 text-xs text-gray-400">
          {helper}
        </p>
      )}
    </div>
  );
}
