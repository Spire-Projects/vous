import type { OrderStatus } from "@/domain/entities/order.entity";

interface Config {
  label: string;
  classes: string;
}

const STATUS_CONFIG: Record<OrderStatus, Config> = {
  pending: { label: "Pendiente", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  payment_sent: {
    label: "Pago enviado",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  verifying_payment: {
    label: "Verificando pago",
    classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  confirmed: { label: "Confirmado", classes: "bg-teal-50 text-teal-700 border-teal-200" },
  preparing: { label: "Preparando", classes: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped: { label: "Enviado", classes: "bg-sky-50 text-sky-700 border-sky-200" },
  delivered: { label: "Entregado", classes: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelado", classes: "bg-red-50 text-red-700 border-red-200" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, classes } = STATUS_CONFIG[status] ?? {
    label: status,
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-block border font-nav text-[9px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 ${classes}`}
    >
      {label}
    </span>
  );
}
