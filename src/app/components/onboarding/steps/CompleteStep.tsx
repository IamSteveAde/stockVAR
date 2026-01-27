export default function CompleteStep({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">Your business is ready 🎉</h2>
      <p className="text-sm text-gray-600">
        Let’s take you to your dashboard.
      </p>
      <button
        onClick={onFinish}
        className="w-full rounded-lg bg-[#0F766E] py-3 text-white"
      >
        Go to dashboard
      </button>
    </div>
  );
}
