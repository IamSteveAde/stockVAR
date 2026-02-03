import Link from "next/link";
export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm my-10">
      <h3 className="font-medium mb-4 text-[#0F766E]">Quick Actions</h3>

      

<div className="flex flex-wrap gap-3">
  <Link
    href="/dashboard/stock"
    className="px-4 py-2 rounded-lg bg-[#0F766E] text-white text-sm inline-flex items-center"
  >
    Add Stock Item
  </Link>

  <Link
    href="/dashboard/audit"
    className="px-4 py-2 rounded-lg border text-sm inline-flex items-center"
  >
    View Audit Trail
  </Link>

  <Link
    href="/dashboard/reports"
    className="px-4 py-2 rounded-lg border text-sm inline-flex items-center"
  >
    View VAR Report
  </Link>
</div>

    </div>
  );
}
