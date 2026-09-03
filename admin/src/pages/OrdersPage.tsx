import { useState } from "react";
import { Search, Receipt, TrendingUp, Clock, Filter, Calendar } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { OrderDetailDrawer } from "@/components/order/OrderDetailDrawer";
import { useOrders } from "@/hooks/useOrders";
import { getOrderStatusLabel } from "../utils";
import type { Order, OrderStatus } from "@/domain/entities/order.entity";

const STATUS_BADGE: Record<OrderStatus, BadgeProps["variant"]> = {
  pending: "pending",
  payment_sent: "payment",
  verifying_payment: "verifying",
  confirmed: "confirmed",
  preparing: "preparing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

type DateFilter = "all" | "today" | "week" | "month";

function passesDateFilter(createdAt: string | undefined, filter: DateFilter): boolean {
  if (filter === "all" || !createdAt) return true;
  const date = new Date(createdAt);
  const now = new Date();
  if (filter === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (filter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  }
  if (filter === "month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return true;
}

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "Pago Enviado", value: "payment_sent" },
  { label: "Verificando", value: "verifying_payment" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Preparando", value: "preparing" },
  { label: "Enviado", value: "shipped" },
  { label: "Entregado", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
];

const DATE_TABS: { label: string; value: DateFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
];

export function OrdersPage() {
  const { orders, loading, error, changeStatus, cancelWithStockRestore, updateNotes } =
    useOrders();

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const today = new Date().toDateString();
  const todayCount = orders.filter((o) => {
    return o.createdAt ? new Date(o.createdAt).toDateString() === today : false;
  }).length;

  const inProgressCount = orders.filter((o) =>
    ["payment_sent", "verifying_payment", "confirmed", "preparing", "shipped"].includes(o.status)
  ).length;

  const pendingPaymentCount = orders.filter(
    (o) => o.status === "pending" || o.status === "payment_sent"
  ).length;

  const filtered = orders.filter((o) => {
    const matchStatus = statusTab === "all" || o.status === statusTab;
    const matchDate = passesDateFilter(o.createdAt, dateFilter);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q);
    return matchStatus && matchDate && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Gestión de Pedidos"
        subtitle="Listado en tiempo real con actualización automática."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Nuevos Hoy"
          value={todayCount.toString()}
          icon={<TrendingUp size={24} strokeWidth={1} />}
        />
        <StatCard
          label="En Proceso"
          value={inProgressCount.toString()}
          icon={<Receipt size={24} strokeWidth={1} />}
        />
        <StatCard
          label="Pendientes Pago"
          value={pendingPaymentCount.toString()}
          icon={<Clock size={24} strokeWidth={1} />}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-lg border border-white/60 rounded-3xl shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-4 border-b border-white/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-text-secondary"
              />
              <Input
                placeholder="Buscar pedido o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {STATUS_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={statusTab === tab.value ? "default" : "outline"}
                onClick={() => setStatusTab(tab.value)}
              >
                <Filter size={12} />
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {DATE_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={dateFilter === tab.value ? "default" : "outline"}
                onClick={() => setDateFilter(tab.value)}
              >
                <Calendar size={12} />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-gold rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center py-12 font-sans text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 font-sans text-sm text-vous-text-secondary">
            No hay pedidos que coincidan con los filtros.
          </p>
        ) : (
          <>
            {/* ── Mobile: cards ───────────────────────────────────────── */}
            <div className="block md:hidden divide-y divide-white/30">
              {filtered.map((order) => {
                const dateStr = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })
                  : "—";
                return (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-amber-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-nav text-[13px] font-semibold text-vous-text">{order.orderNumber}</span>
                      <Badge variant={STATUS_BADGE[order.status]}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                      <div>
                        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Cliente</span>
                        <p className="text-vous-text font-medium mt-0.5">{order.customer.name}</p>
                        <p className="text-vous-text-secondary text-[11px]">{order.customer.email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Fecha</span>
                        <p className="text-vous-text mt-0.5">{dateStr}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-nav uppercase text-vous-text-secondary">Total</span>
                        <p className="text-vous-text font-semibold mt-0.5">Bs. {order.total.toLocaleString("es-BO")}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>
                          Ver detalle
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop: table ──────────────────────────────────────── */}
            <div className="hidden md:block">
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
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-amber-50/40 transition-colors"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="font-nav text-[12px] font-semibold">{order.orderNumber}</TableCell>
                      <TableCell>
                        <p className="text-[13px] font-sans text-vous-text">{order.customer.name}</p>
                        <p className="text-[11px] text-vous-text-secondary">{order.customer.email}</p>
                      </TableCell>
                      <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </TableCell>
                      <TableCell className="font-nav text-[13px] font-semibold">Bs. {order.total.toLocaleString("es-BO")}</TableCell>
                      <TableCell><Badge variant={STATUS_BADGE[order.status]}>{getOrderStatusLabel(order.status)}</Badge></TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Ver detalle</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={changeStatus}
        onCancelWithRestore={cancelWithStockRestore}
        onNotesUpdate={updateNotes}
      />
    </div>
  );
}
