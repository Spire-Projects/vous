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
      <div className="h-64 flex items-center justify-center text-vous-text-secondary font-sans text-sm">
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
            tick={{ fontSize: 11, fill: "#6B6B65" }}
            axisLine={{ stroke: "#E8E5E1" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6B6B65" }}
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
              backgroundColor: "#FFFFFF",
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
            fill="#0D0D0C"
            radius={[2, 2, 0, 0]}
            name="orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
