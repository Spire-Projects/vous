// ── Módulo de reportes — solo panel administrativo ──────────────────────────

/** Períodos predefinidos para filtros de reportes */
export type ReportPeriod =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "custom";

/** Rango personalizado de fechas */
export interface DateRange {
  from: Date;
  to: Date;
}

/** Resumen general de ventas para el dashboard */
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  /** Comparación con el período anterior (porcentaje, positivo = crecimiento) */
  revenueChange?: number;
  ordersChange?: number;
}

/** Punto de datos para gráfico de barras (ventas por período) */
export interface SalesDataPoint {
  /** Etiqueta del eje X, ej: "14 May", "Lun", "Sem 20" */
  label: string;
  revenue: number;
  orders: number;
}

/** Producto más vendido en un período */
export interface TopProduct {
  productId: string;
  productName: string;
  imageUrl?: string;
  unitsSold: number;
  revenue: number;
}

/** Fila resumida de pedido para la tabla de administración */
export interface OrderSummaryRow {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: import("./order.types").OrderStatus;
  paymentMethod: import("./order.types").PaymentMethod;
  createdAt: import("./base.types").AnyTimestamp;
}

/** Respuesta completa del módulo de reportes */
export interface ReportData {
  period: ReportPeriod;
  dateRange: DateRange;
  summary: SalesSummary;
  salesChart: SalesDataPoint[];
  topProducts: TopProduct[];
  recentOrders: OrderSummaryRow[];
}
