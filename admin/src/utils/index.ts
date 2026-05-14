import type { OrderStatus, StockStatus, WholesaleStatus } from "../types";

export function getOrderStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    PENDIENTE: "bg-amber-100 text-amber-800",
    CONFIRMADO: "bg-blue-100 text-blue-800",
    PREPARANDO: "bg-purple-100 text-purple-800",
    ENVIADO: "bg-sky-100 text-sky-800",
    ENTREGADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function getStockStatusClass(status: StockStatus): string {
  const map: Record<StockStatus, string> = {
    ACTIVO: "bg-green-100 text-green-800",
    INACTIVO: "bg-gray-100 text-gray-500",
    AGOTADO: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function getWholesaleStatusClass(status: WholesaleStatus): string {
  const map: Record<WholesaleStatus, string> = {
    PENDIENTE: "bg-amber-100 text-amber-800",
    APROBADO: "bg-green-100 text-green-800",
    RECHAZADO: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(amount);
}
