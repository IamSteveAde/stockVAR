const TYPES = [
  "Restaurant",
  "Café",
  "Lounge / Bar",
  "Hotel Kitchen",
  "Cloud Kitchen",
  "Retail / Experience Centre",
];

export default function BusinessTypeStep({ value, onChange, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Business type</h2>

      <div className="grid grid-cols-2 gap-3">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`border rounded-lg py-3 text-sm ${
              value === type ? "border-[#0F766E] bg-[#0F766E]/10" : ""
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="w-1/2 border rounded-lg py-3">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="w-1/2 bg-[#0F766E] text-white rounded-lg py-3 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
