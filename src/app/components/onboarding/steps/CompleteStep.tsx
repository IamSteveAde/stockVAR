import { Loader2 } from "lucide-react";

export default function CompleteStep({ 
  onFinish, 
  isLoading 
}: { 
  onFinish: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Your business is ready 🎉</h2>
      <p className="text-sm text-gray-600">
        Let’s take you to your dashboard.
      </p>
      <button
        onClick={onFinish}
        disabled={isLoading}
        className={`w-full rounded-lg py-3 text-white transition flex items-center justify-center gap-2 ${
          isLoading ? "bg-[#0F766E]/60 cursor-not-allowed" : "bg-[#0F766E] hover:bg-[#0B5F58]"
        }`}
      >
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {isLoading ? "Setting up..." : "Go to dashboard"}
      </button>
    </div>
  );
}
