"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SalesDataPoint } from "@/domain/entities/report.entity";
import { formatCurrency } from "@/utils";

interface SalesChartProps {
  data: SalesDataPoint[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-vous-gray font-sans text-sm">
        No hay datos para el período seleccionado
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E5E1" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9E9E9E" }}
            axisLine={{ stroke: "#E8E5E1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9E9E9E" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `Bs. ${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [
              name === "revenue" ? formatCurrency(Number(value)) : `${value} pedidos`,
              name === "revenue" ? "Ingresos" : "Pedidos",
            ]}
            contentStyle={{
              fontSize: 12,
              border: "1px solid #E8E5E1",
              borderRadius: 0,
            }}
          />
          <Legend
            formatter={(value: string) =>
              value === "revenue" ? "Ingresos" : "Pedidos"
            }
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey="revenue"
            fill="#C9A84C"
            radius={[2, 2, 0, 0]}
            name="revenue"
          />
          <Bar
            dataKey="orders"
            fill="#1A1A1A"
            radius={[2, 2, 0, 0]}
            name="orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
