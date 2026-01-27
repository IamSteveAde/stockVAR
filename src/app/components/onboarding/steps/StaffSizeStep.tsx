const OPTIONS = ["1–5", "6–15", "16–30", "30+"];

export default function StaffSizeStep({ value, onChange, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Daily staff size</h2>

      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-full border rounded-lg py-3 ${
            value === opt ? "border-[#0F766E] bg-[#0F766E]/10" : ""
          }`}
        >
          {opt}
        </button>
      ))}

      <div className="flex gap-3">
        <button onClick={onPrev} className="w-1/2 border rounded-lg py-3">
          Back
        </button>
        <button onClick={onNext} className="w-1/2 bg-[#0F766E] text-white rounded-lg py-3">
          Finish
        </button>
      </div>
    </div>
  );
}
