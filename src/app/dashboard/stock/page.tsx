import StockTabs from "../../components/stock/StockTabs";

export default function StockPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#111827]">Stock</h1>
      <StockTabs />
    </div>
  );
}
