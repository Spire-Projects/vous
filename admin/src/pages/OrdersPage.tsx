import { useState } from "react";
import {
  Search,
  Receipt,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  FileText,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
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

function passesDateFilter(
  createdAt: string | undefined,
  filter: DateFilter,
): boolean {
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
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }
  return true;
}

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Todas las etapas", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "En Préstamo", value: "preparing" },
  { label: "En Cobro", value: "verifying_payment" },
  { label: "Venta Cerrada", value: "delivered" },
  { label: "Cancelado", value: "cancelled" },
];

const DATE_TABS: { label: string; value: DateFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
];

export function OrdersPage() {
  const {
    orders,
    loading,
    error,
    changeStatus,
    cancelWithStockRestore,
    updateNotes,
  } = useOrders();

  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const today = new Date().toDateString();
  const todayCount = orders.filter((o) => {
    return o.createdAt ? new Date(o.createdAt).toDateString() === today : false;
  }).length;

  const inProgressCount = orders.filter((o) =>
    [
      "payment_sent",
      "verifying_payment",
      "confirmed",
      "preparing",
      "shipped",
    ].includes(o.status),
  ).length;

  const pendingPaymentCount = orders.filter(
    (o) => o.status === "pending" || o.status === "payment_sent",
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
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)]">
      {/* Page Header */}
      <PageHeader
        category="Gestión"
        title="Procesos de Venta"
        subtitle="Gestiona préstamos pedagógicos, entregas en escuelas, cobros y ventas sueltas."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="default"
              onClick={() => {
                const first = orders[0];
                if (first) setSelectedOrder(first);
              }}
              className="gap-2"
            >
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span>Venta Suelta</span>
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={() => {
                const first = orders[0];
                if (first) setSelectedOrder(first);
              }}
              className="gap-2"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Nuevo Préstamo</span>
            </Button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Nuevos Hoy"
          value={todayCount.toString()}
          icon={<TrendingUp size={22} strokeWidth={2} />}
        />
        <StatCard
          label="En Proceso"
          value={inProgressCount.toString()}
          icon={<Receipt size={22} strokeWidth={2} />}
        />
        <StatCard
          label="Pendientes Pago"
          value={pendingPaymentCount.toString()}
          icon={<Clock size={22} strokeWidth={2} />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Buscar por código, notas, profesor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter pill tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {STATUS_TABS.slice(0, 4).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusTab(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusTab === tab.value
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date filter pill tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {DATE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setDateFilter(tab.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  dateFilter === tab.value
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="inline-block w-6 h-6 border-2 border-slate-200 border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center py-12 font-sans text-sm text-rose-600">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-sm text-slate-400 font-medium">
            No hay procesos de venta que coincidan con los filtros.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44">CÓDIGO</TableHead>
                <TableHead>ESCUELA / DOCENTE</TableHead>
                <TableHead>ETAPA</TableHead>
                <TableHead>TOTAL / SALDO</TableHead>
                <TableHead>PAGO</TableHead>
                <TableHead className="text-right">ACCIONES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const isPaid =
                  order.status === "delivered" || order.status === "confirmed";
                const isPartial =
                  order.status === "payment_sent" ||
                  order.status === "verifying_payment";
                const isDelivered = order.status === "delivered";

                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* CÓDIGO */}
                    <TableCell>
                      <p className="font-bold text-slate-900 text-sm tracking-tight">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">
                        {order.isWholesale
                          ? "Venta Mayorista"
                          : "Proceso Estándar"}
                      </p>
                    </TableCell>

                    {/* ESCUELA / DOCENTE */}
                    <TableCell>
                      <p className="font-bold text-slate-800 text-sm">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
                        {order.customer.phone || order.customer.email}
                      </p>
                    </TableCell>

                    {/* ETAPA */}
                    <TableCell>
                      <Badge variant={STATUS_BADGE[order.status]}>
                        {isDelivered && (
                          <CheckCircle2 size={11} className="shrink-0 text-emerald-600" />
                        )}
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </TableCell>

                    {/* TOTAL / SALDO */}
                    <TableCell>
                      <p className="font-bold text-slate-900 text-sm">
                        Bs. {order.total.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cobrado: Bs.{" "}
                        {isPaid
                          ? order.total.toLocaleString("es-BO", { minimumFractionDigits: 2 })
                          : "0.00"}{" "}
                        {!isPaid && (
                          <span className="text-rose-600 font-semibold">
                            (Debe: {order.total.toLocaleString("es-BO", { minimumFractionDigits: 2 })})
                          </span>
                        )}
                      </p>
                    </TableCell>

                    {/* PAGO */}
                    <TableCell>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          Pagado 100%
                        </span>
                      ) : isPartial ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                          Pago Parcial
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                          Pendiente
                        </span>
                      )}
                    </TableCell>

                    {/* ACCIONES */}
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          title="Ver nota / proceso"
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/30 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
                        >
                          <FileText size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          title="Ver detalle completo"
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/30 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
                        >
                          <ExternalLink size={15} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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
