import { useState } from "react";
import { Search, Receipt, TrendingUp, Clock } from "lucide-react";
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

// ── Status badge mapping ────────────────────────────────────────────────────

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

// ── Date filter ─────────────────────────────────────────────────────────────

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

// ── Filter tabs ─────────────────────────────────────────────────────────────

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

// ── Component ───────────────────────────────────────────────────────────────

export function OrdersPage() {
  const { orders, loading, error, changeStatus, cancelWithStockRestore, updateNotes } =
    useOrders();

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ── Derived stats ─────────────────────────────────────────────────────────
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

  // ── Filtered list ─────────────────────────────────────────────────────────
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
    <div className="p-8">
      <PageHeader
        title="Gestión de Pedidos"
        subtitle="Listado en tiempo real con actualización automática."
      />

      {/* Stats */}
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

      <div className="bg-vous-white border border-vous-border">
        {/* Toolbar */}
        <div className="p-4 border-b border-vous-border flex flex-col gap-3">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-vous-gray"
              />
              <Input
                placeholder="Buscar pedido o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-1">
            {STATUS_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={statusTab === tab.value ? "default" : "outline"}
                onClick={() => setStatusTab(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Date filter */}
          <div className="flex gap-1">
            {DATE_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={dateFilter === tab.value ? "default" : "outline"}
                onClick={() => setDateFilter(tab.value)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="inline-block w-5 h-5 border-2 border-vous-border border-t-vous-black rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center py-12 font-sans text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 font-sans text-sm text-vous-gray">
            No hay pedidos que coincidan con los filtros.
          </p>
        ) : (
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
                  className="cursor-pointer hover:bg-vous-cream/50 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-nav text-[12px] font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <p className="text-[13px] font-sans text-vous-black">{order.customer.name}</p>
                    <p className="text-[11px] text-vous-gray">{order.customer.email}</p>
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-gray">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("es-BO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="font-nav text-[13px] font-semibold">
                    Bs. {order.total.toLocaleString("es-BO")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[order.status]}>
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail drawer */}
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
