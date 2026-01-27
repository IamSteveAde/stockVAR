import { Package, AlertTriangle, Users, BarChart } from "lucide-react";

const cards = [
  { title: "Stock Items", value: "12", icon: Package },
  { title: "Today's VAR", value: "-3 kg", icon: AlertTriangle },
  { title: "Staff on Shift", value: "5", icon: Users },
  { title: "Reports", value: "View", icon: BarChart },
];

export default function OverviewCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
      {cards.map(({ title, value, icon: Icon }) => (
        <div
          key={title}
          className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="h-10 w-10 rounded-lg bg-[#0F766E]/10 flex items-center justify-center">
            <Icon size={18} className="text-[#0F766E]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
