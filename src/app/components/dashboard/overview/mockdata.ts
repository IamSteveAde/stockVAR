export type StockRow = {
  date: string;
  product: string;
  opening: number;
  used: number;
  closing: number;
  unit: string;
};

export const STOCK_DATA: StockRow[] = Array.from({ length: 28 }).map(
  (_, i) => ({
    date: `2026-01-${(i % 7) + 20}`,
    product: ["Rice", "Oil", "Chicken", "Tomatoes"][i % 4],
    opening: 200,
    used: 30 + (i % 10),
    closing: 200 - (30 + (i % 10)),
    unit: "kg",
  })
);