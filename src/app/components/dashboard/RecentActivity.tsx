const items = [
  { name: "Rice", opening: "50 kg", used: "15 kg", closing: "32 kg", var: "-3 kg" },
  { name: "Oil", opening: "10 L", used: "2 L", closing: "8 L", var: "0 L" },
  { name: "Chicken", opening: "20 pcs", used: "8 pcs", closing: "12 pcs", var: "0 pcs" },
  { name: "Chicken", opening: "20 pcs", used: "8 pcs", closing: "12 pcs", var: "0 pcs" },
  { name: "Chicken", opening: "20 pcs", used: "8 pcs", closing: "12 pcs", var: "0 pcs" },
  { name: "Chicken", opening: "20 pcs", used: "8 pcs", closing: "12 pcs", var: "0 pcs" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
  <h3 className="text-sm font-medium text-[#0F766E]">Stock Items</h3>
  <button className="text-sm text-[#0F766E] hover:underline">
    View more
  </button>
</div>


      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left py-2">Item</th>
            <th>Opening</th>
            <th>Used</th>
            <th>Closing</th>
            <th>VAR</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-t">
              <td className="py-3">{item.name}</td>
              <td className="text-center">{item.opening}</td>
              <td className="text-center">{item.used}</td>
              <td className="text-center">{item.closing}</td>
              <td className="text-center text-red-600">{item.var}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
