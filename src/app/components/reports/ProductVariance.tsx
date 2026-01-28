const products = [
  { name: "Rice", variance: "₦60,000", count: 6 },
  { name: "Oil", variance: "₦40,000", count: 4 },
];

export default function ProductVariance() {
  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.name}
          className="flex justify-between border-b py-3"
        >
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-xs text-gray-500">
              {p.count} incidents
            </p>
          </div>
          <p className="font-semibold">{p.variance}</p>
        </div>
      ))}
    </div>
  );
}