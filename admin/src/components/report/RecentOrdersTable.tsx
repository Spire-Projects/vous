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
      <div className="py-12 text-center text-vous-gray font-sans text-sm">
        No hay pedidos en este período
      </div>
    );
  }

  return (
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
              <span className="font-nav text-[13px] font-semibold text-vous-black">
                {o.orderNumber}
              </span>
            </TableCell>
            <TableCell className="font-sans text-sm text-vous-gray">
              {o.customerName}
            </TableCell>
            <TableCell className="text-right font-nav text-sm text-vous-black">
              {formatCurrency(o.total)}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[o.status] ?? "pending"}>
                {getOrderStatusLabel(o.status as OrderStatus)}
              </Badge>
            </TableCell>
            <TableCell className="font-sans text-xs text-vous-gray">
              {o.createdAt ? formatDate(o.createdAt) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
