export default function AccessLocked() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">
          Access temporarily restricted
        </h2>
        <p className="text-sm text-gray-600">
          Ask the owner to activate the
          subscription.
        </p>
      </div>
    </div>
  );
}