"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  name: string;
  income: number;
}

interface IncomeChartProps {
  data: ChartDataItem[];
}

export default function IncomeChart({ data }: IncomeChartProps) {
  return (
    <section className="chart-panel">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            stroke="#64748B"
            tick={{ fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke="#64748B"
            tick={{ fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#003554"
            strokeWidth={4}
            dot={{ r: 6, fill: "#003554", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <style jsx>{`
        .chart-panel {
          background-color: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </section>
  );
}