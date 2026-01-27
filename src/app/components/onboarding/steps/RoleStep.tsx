export default function RoleStep({ value, onChange, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your role</h2>

      {["owner", "manager"].map((role) => (
        <button
          key={role}
          onClick={() => onChange(role)}
          className={`w-full border rounded-lg py-3 ${
            value === role ? "border-[#0F766E] bg-[#0F766E]/10" : ""
          }`}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}

      <div className="flex gap-3">
        <button onClick={onPrev} className="w-1/2 border rounded-lg py-3">
          Back
        </button>
        <button onClick={onNext} className="w-1/2 bg-[#0F766E] text-white rounded-lg py-3">
          Next
        </button>
      </div>
    </div>
  );
}
