export default function LocationStep({ value, onChange, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Where is your business?</h2>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="City (e.g. Lagos)"
        className="w-full border rounded-lg px-4 py-3"
      />

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
