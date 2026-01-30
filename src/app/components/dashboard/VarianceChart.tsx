"use client";

import {
  AlertTriangle,
  Calendar,
  ArrowRight,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  LabelList,
  Cell,
} from "recharts";

type VarianceItem = {
  name: string;
  variance: number;
};

export default function VarianceChart({
  data,
}: {
  data: VarianceItem[];
}) {
  const router = useRouter();

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm h-full flex items-center justify-center text-sm text-gray-400">
        No variance data
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#0F766E]">
          Stock Variance by Item
        </h3>

        <button
          onClick={() => router.push("/dashboard/reports")}
          className="text-xs text-[#0F766E] flex items-center gap-1 hover:underline"
        >
          View full report
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
            />

            <YAxis
              tick={{ fontSize: 11 }}
              label={{
                value: "Variance",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: "#6B7280" },
              }}
            />

            <ReferenceLine y={0} stroke="#000" />

            <Bar dataKey="variance" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="variance"
                position="top"
                style={{ fontSize: 11, fill: "#374151" }}
              />

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.variance < 0 ? "#DC2626" : "#FACC15"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
