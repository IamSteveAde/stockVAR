import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function EntrySuccess({
  onNewEntry,
}: {
  onNewEntry: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-6">
      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0F766E]/10">
        <CheckCircle size={28} className="text-[#0F766E]" />
      </div>

      {/* Text */}
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">
          Entry saved successfully
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          The stock movement has been recorded.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onNewEntry}
          className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-medium text-white hover:bg-[#0B5F58]"
        >
          Add another entry
        </button>

        <Link
          href="/dashboard"
          className="block text-sm text-[#0F766E] hover:underline"
        >
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
}