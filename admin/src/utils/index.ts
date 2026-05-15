import type { OrderStatus, WholesaleRequestStatus } from "../types";

// ── Clases de color para estados de pedido ─────────────────────────────────

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "Pendiente",
    payment_sent: "Pago Enviado",
    verifying_payment: "Verificando Pago",
    confirmed: "Confirmado",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };
  return map[status] ?? status;
}

export function getOrderStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    payment_sent: "bg-blue-100 text-blue-800",
    verifying_payment: "bg-purple-100 text-purple-800",
    confirmed: "bg-sky-100 text-sky-800",
    preparing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-teal-100 text-teal-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

// ── Clases de color para stock ──────────────────────────────────────────────

export type StockStatus = "active" | "inactive" | "out_of_stock";

export function getStockStatusLabel(status: StockStatus): string {
  const map: Record<StockStatus, string> = {
    active: "Activo",
    inactive: "Inactivo",
    out_of_stock: "Agotado",
  };
  return map[status] ?? status;
}

export function getStockStatusClass(status: StockStatus): string {
  const map: Record<StockStatus, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-500",
    out_of_stock: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

// ── Clases de color para solicitudes mayoristas ─────────────────────────────

export function getWholesaleStatusLabel(status: WholesaleRequestStatus): string {
  const map: Record<WholesaleRequestStatus, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };
  return map[status] ?? status;
}

export function getWholesaleStatusClass(status: WholesaleRequestStatus): string {
  const map: Record<WholesaleRequestStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}

// ── Formateo de moneda ──────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return `Bs. ${amount.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ── Formateo de fecha ───────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
