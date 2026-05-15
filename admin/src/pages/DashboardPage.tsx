import { TrendingUp, ShoppingBag, Package, Users } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { getOrderStatusLabel } from "../utils";
import type { OrderStatus } from "../types";

type OrderPreview = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
};

function statusVariant(status: OrderStatus): BadgeProps["variant"] {
  const map: Record<OrderStatus, BadgeProps["variant"]> = {
    pending: "pending", payment_sent: "payment", verifying_payment: "payment",
    confirmed: "confirmed", preparing: "preparing",
    shipped: "shipped", delivered: "delivered", cancelled: "cancelled",
  };
  return map[status] ?? "default";
}

const METRICS = [
  {
    label: "Ventas Totales",
    value: "Bs. 142,850",
    change: "+4.2% vs semana anterior",
    isPositive: true,
    icon: <TrendingUp size={28} strokeWidth={1} />,
  },
  {
    label: "Volumen de Pedidos",
    value: "1,102",
    change: "+12.5% vs semana anterior",
    isPositive: true,
    icon: <ShoppingBag size={28} strokeWidth={1} />,
  },
  {
    label: "Clientes",
    value: "4,310",
    change: "+87 nuevos este mes",
    isPositive: true,
    icon: <Users size={28} strokeWidth={1} />,
  },
];

const RECENT_ORDERS: OrderPreview[] = [
  { id: "#VO-92834", customerName: "Julianna Rossi", customerEmail: "j.rossi@email.com", date: "24 Oct, 2024", total: 1250, status: "delivered" },
  { id: "#VO-92835", customerName: "Marcello Vargas", customerEmail: "m.vargas@email.com", date: "24 Oct, 2024", total: 890, status: "pending" },
  { id: "#VO-92836", customerName: "Sofía Laurent", customerEmail: "s.laurent@email.com", date: "23 Oct, 2024", total: 2450, status: "shipped" },
  { id: "#VO-92837", customerName: "André Dubois", customerEmail: "a.dubois@email.com", date: "23 Oct, 2024", total: 5100, status: "confirmed" },
];

export function DashboardPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="Analytics Overview"
        subtitle="Resumen del rendimiento VOUS hoy."
        action={
          <Button variant="outline">Exportar Reporte</Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {METRICS.map((m) => (
          <StatCard key={m.label} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        <div className="xl:col-span-2 bg-vous-white border border-vous-border p-6">
          <h2 className="text-[11px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-6">
            Crecimiento de Ingresos
          </h2>
          <div className="h-40 flex items-end gap-2">
            {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((day, i) => {
              const heights = [45, 62, 38, 75, 90, 58, 42];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-vous-gold/20 relative"
                    style={{ height: `${heights[i]}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-vous-gold"
                      style={{ height: `${60 + i * 5}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-nav text-vous-gray">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-vous-white border border-vous-border p-6">
          <h2 className="text-[11px] font-nav uppercase tracking-[0.15em] text-vous-gray mb-4">
            Desglose de Ingresos
          </h2>
          <p className="font-serif text-3xl text-vous-black">Bs. 284,500</p>
          <p className="text-xs text-vous-gray font-nav mb-4">82% de meta alcanzada</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-nav mb-1">
                <span className="text-vous-black">Ventas Directas</span>
                <span className="text-vous-gray">Bs. 210k</span>
              </div>
              <div className="h-1.5 bg-vous-border">
                <div className="h-full bg-vous-black" style={{ width: "74%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-nav mb-1">
                <span className="text-vous-black">Mayoristas</span>
                <span className="text-vous-gray">Bs. 74.5k</span>
              </div>
              <div className="h-1.5 bg-vous-border">
                <div className="h-full bg-vous-gold" style={{ width: "26%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-vous-white border border-vous-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[11px] font-nav uppercase tracking-[0.15em] text-vous-gray">
            Pedidos Recientes
          </h2>
          <a href="/pedidos" className="text-[11px] font-nav uppercase tracking-wider text-vous-gold hover:underline">
            Ver todos →
          </a>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {["Pedido", "Cliente", "Fecha", "Total", "Estado"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {RECENT_ORDERS.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-nav text-[12px] font-semibold">{order.id}</TableCell>
                <TableCell>
                  <p className="text-[13px] font-sans text-vous-black">{order.customerName}</p>
                  <p className="text-[11px] text-vous-gray">{order.customerEmail}</p>
                </TableCell>
                <TableCell className="text-[12px] font-sans text-vous-gray">{order.date}</TableCell>
                <TableCell className="font-nav text-[13px] font-semibold">
                  Bs. {order.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
