import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { RecentOrderRow } from "@/domain/entities/report.entity";
import { formatCurrency, formatDate } from "@/utils";
import { getOrderStatusLabel } from "@/utils";
import type { OrderStatus } from "@/domain/entities/order.entity";

const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  confirmed: "confirmed",
  preparing: "preparing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  pending: "pending",
  payment_sent: "payment",
  verifying_payment: "verifying",
};

interface RecentOrdersTableProps {
  orders: RecentOrderRow[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center text-vous-text-secondary font-sans text-sm">
        No hay pedidos en este período
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden divide-y divide-white/30">
        {orders.map((o) => (
          <div key={o.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Pedido</span>
                <span className="font-nav text-[13px] font-semibold text-vous-text">
                  {o.orderNumber}
                </span>
              </div>
              <Badge variant={STATUS_VARIANT[o.status] ?? "pending"}>
                {getOrderStatusLabel(o.status as OrderStatus)}
              </Badge>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Fecha</span>
                <p className="font-sans text-xs text-vous-text-secondary">
                  {o.createdAt ? formatDate(o.createdAt) : "—"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Total</span>
                <p className="font-nav text-sm text-vous-text">
                  {formatCurrency(o.total)}
                </p>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-nav uppercase text-vous-text-secondary block">Cliente</span>
              <p className="font-sans text-sm text-vous-text-secondary">
                {o.customerName}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <span className="font-nav text-[13px] font-semibold text-vous-text">
                    {o.orderNumber}
                  </span>
                </TableCell>
                <TableCell className="font-sans text-sm text-vous-text-secondary">
                  {o.customerName}
                </TableCell>
                <TableCell className="text-right font-nav text-sm text-vous-text">
                  {formatCurrency(o.total)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[o.status] ?? "pending"}>
                    {getOrderStatusLabel(o.status as OrderStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="font-sans text-xs text-vous-text-secondary">
                  {o.createdAt ? formatDate(o.createdAt) : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
