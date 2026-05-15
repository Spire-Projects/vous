import { useState } from "react";
import { Search, Receipt, Eye, TrendingUp } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const statusVariantMap: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "pending", payment_sent: "payment", verifying_payment: "payment",
  confirmed: "confirmed", preparing: "preparing",
  shipped: "shipped", delivered: "delivered", cancelled: "cancelled",
};

const ALL_ORDERS: OrderPreview[] = [
  { id: "#VO-8829", customerName: "Adrián Martínez", customerEmail: "adrian.m@email.com", date: "24 Oct, 2024", total: 1240, status: "shipped" },
  { id: "#VO-8830", customerName: "Elena Llopis", customerEmail: "elena.l@email.com", date: "24 Oct, 2024", total: 890, status: "pending" },
  { id: "#VO-8831", customerName: "Ricardo Costa", customerEmail: "r.costa@email.com", date: "23 Oct, 2024", total: 3150, status: "shipped" },
  { id: "#VO-8832", customerName: "Sofía Beltrán", customerEmail: "sofia.b@email.com", date: "23 Oct, 2024", total: 450, status: "confirmed" },
  { id: "#VO-8833", customerName: "Carlos Mendez", customerEmail: "c.mendez@email.com", date: "22 Oct, 2024", total: 1800, status: "delivered" },
  { id: "#VO-8834", customerName: "Valentina Cruz", customerEmail: "v.cruz@email.com", date: "22 Oct, 2024", total: 620, status: "cancelled" },
];

const TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendiente Pago", value: "pending" },
  { label: "Enviado", value: "shipped" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Preparando", value: "preparing" },
  { label: "Entregado", value: "delivered" },
];

export function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");

  const filtered = ALL_ORDERS.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-8">
      <PageHeader
        title="Listado de Pedidos"
        subtitle="Gestión de ventas y flujo de estados en tiempo real."
        action={<Button variant="outline">Exportar CSV</Button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Nuevos Hoy" value="24" icon={<TrendingUp size={24} strokeWidth={1} />} />
        <StatCard label="En Camino" value="12" icon={<Receipt size={24} strokeWidth={1} />} />
      </div>

      <div className="bg-vous-white border border-vous-border">
        <div className="p-4 border-b border-vous-border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray" />
            <Input
              placeholder="Buscar pedido o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={activeTab === tab.value ? "default" : "outline"}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {["Pedido", "Cliente", "Fecha", "Total", "Estado", "Acciones"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
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
                  <Badge variant={statusVariantMap[order.status]}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button className="text-vous-gray hover:text-vous-black transition-colors" title="Ver detalle">
                    <Eye size={16} strokeWidth={1.5} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-vous-gray">
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="px-4 py-3 border-t border-vous-border flex items-center justify-between">
          <p className="text-[11px] text-vous-gray font-nav">
            Mostrando {filtered.length} de {ALL_ORDERS.length} pedidos
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 text-[12px] font-nav border ${p === 1 ? "bg-vous-black text-vous-white border-vous-black" : "border-vous-border text-vous-gray hover:border-vous-black"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
