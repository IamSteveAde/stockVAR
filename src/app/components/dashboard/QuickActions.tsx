export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm my-10">
      <h3 className="font-medium mb-4 text-[#0F766E]">Quick Actions</h3>

      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 rounded-lg bg-[#0F766E] text-white text-sm">
          Add Stock Item
        </button>
        <button className="px-4 py-2 rounded-lg border text-sm">
          Log Usage
        </button>
        <button className="px-4 py-2 rounded-lg border text-sm">
          View VAR Report
        </button>
      </div>
    </div>
  );
}
