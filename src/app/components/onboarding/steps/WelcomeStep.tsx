export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-2xl font-semibold">Let’s set up your business</h1>
      <p className="text-sm text-gray-600">
        This will take less than 2 minutes.
      </p>
      <button
        onClick={onNext}
        className="w-full rounded-lg bg-[#0F766E] py-3 text-white"
      >
        Get started
      </button>
    </div>
  );
}
