export default function EntryTypeSelector({
  value,
  onChange,
}: {
  value: "in" | "out" | null;
  onChange: (v: "in" | "out") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onChange("in")}
        className={`p-4 rounded-xl border text-center ${
          value === "in"
            ? "border-[#0F766E] bg-[#0F766E]/10"
            : "hover:bg-gray-50"
        }`}
      >
        <p className="font-medium">Stock In</p>
        <p className="text-xs text-gray-500">Add to stock</p>
      </button>

      <button
        onClick={() => onChange("out")}
        className={`p-4 rounded-xl border text-center ${
          value === "out"
            ? "border-red-500 bg-red-500/10"
            : "hover:bg-gray-50"
        }`}
      >
        <p className="font-medium">Stock Out</p>
        <p className="text-xs text-gray-500">Remove from stock</p>
      </button>
    </div>
  );
}