import { TrendingUp, ShoppingBag, Users, Receipt } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SalesChart } from "@/components/report/SalesChart";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatDate, getOrderStatusLabel } from "@/utils";
import type { OrderStatus } from "@/domain/entities/order.entity";

function statusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    pending: "pending",
    payment_sent: "payment",
    verifying_payment: "verifying",
    confirmed: "confirmed",
    preparing: "preparing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[status] ?? "default";
}

export function DashboardPage() {
  const { report, customers, recentOrders, revenueBreakdown, loading, error } =
    useDashboard();
  const summary = report?.summary;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-5 sm:p-8 min-h-[calc(100vh-7rem)]">
      <PageHeader
        category="Principal"
        title="Dashboard General"
        subtitle={
          report ? "Métricas en tiempo real, resumen de ventas y estado de operaciones." : "Cargando métricas…"
        }
      />

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ventas Totales"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          change={
            summary
              ? `${summary.revenueChange > 0 ? "+" : ""}${summary.revenueChange}% vs anterior`
              : undefined
          }
          isPositive={summary ? summary.revenueChange >= 0 : undefined}
          icon={<TrendingUp size={28} strokeWidth={1} />}
        />
        <StatCard
          label="Pedidos"
          value={summary ? String(summary.totalOrders) : "—"}
          change={
            summary
              ? `${summary.ordersChange > 0 ? "+" : ""}${summary.ordersChange}% vs anterior`
              : undefined
          }
          isPositive={summary ? summary.ordersChange >= 0 : undefined}
          icon={<ShoppingBag size={28} strokeWidth={1} />}
        />
        <StatCard
          label="Clientes"
          value={customers.length > 0 ? String(customers.length) : "—"}
          icon={<Users size={28} strokeWidth={1} />}
        />
        <StatCard
          label="Ticket Promedio"
          value={formatCurrency(summary?.averageOrderValue ?? 0)}
          icon={<Receipt size={28} strokeWidth={1} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
            Ingresos y Pedidos
          </h2>
          {report?.salesChart ? (
            <SalesChart data={report.salesChart} />
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400 font-sans text-sm">
              {loading ? "Cargando…" : "Sin datos disponibles"}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Desglose de Ingresos
          </h2>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(revenueBreakdown.total)}
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Últimos 30 días
          </p>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-800">Ventas Directas</span>
                <span className="text-slate-500">
                  {formatCurrency(revenueBreakdown.b2c)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-700"
                  style={{ width: `${revenueBreakdown.b2cPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                {revenueBreakdown.b2cPct}%
              </p>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-800">Mayoristas</span>
                <span className="text-slate-500">
                  {formatCurrency(revenueBreakdown.b2b)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A84C] rounded-full transition-all duration-700"
                  style={{ width: `${revenueBreakdown.b2bPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                {revenueBreakdown.b2bPct}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pedidos Recientes
          </h2>
          <a
            href="/pedidos"
            className="text-xs font-semibold text-slate-900 hover:text-[#C9A84C] transition-colors"
          >
            Ver todos →
          </a>
        </div>
        {/* ── Mobile: cards ───────────────────────────────────────── */}
        <div className="block md:hidden divide-y divide-white/30">
          {recentOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-nav text-[13px] font-semibold text-vous-text">
                  {order.orderNumber}
                </span>
                <Badge variant={statusVariant(order.status)}>
                  {getOrderStatusLabel(order.status as OrderStatus)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                <div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary">
                    Cliente
                  </span>
                  <p className="text-vous-text mt-0.5">{order.customer.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary">
                    Fecha
                  </span>
                  <p className="text-vous-text mt-0.5">
                    {formatDate(order.createdAt ?? "")}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-nav uppercase text-vous-text-secondary">
                    Total
                  </span>
                  <p className="text-vous-text font-semibold mt-0.5">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="py-12 text-center text-vous-text-secondary font-sans text-sm">
              {loading ? "Cargando pedidos…" : "No hay pedidos recientes"}
            </div>
          )}
        </div>

        {/* ── Desktop: table ──────────────────────────────────────── */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-nav text-[12px] font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-[13px] font-sans text-vous-text">
                    {order.customer.name}
                  </TableCell>
                  <TableCell className="text-[12px] font-sans text-vous-text-secondary">
                    {formatDate(order.createdAt ?? "")}
                  </TableCell>
                  <TableCell className="font-nav text-[13px] font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(order.status)}>
                      {getOrderStatusLabel(order.status as OrderStatus)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-vous-text-secondary py-8 font-sans text-sm"
                  >
                    {loading ? "Cargando pedidos…" : "No hay pedidos recientes"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
