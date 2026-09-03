/**
 * Report entity — dominio puro.
 */

export type ReportPeriod =
  | "today"
  | "last_7_days"
  | "last_30_days"
  | "this_month"
  | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
}

export interface SalesDataPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  imageUrl?: string;
  unitsSold: number;
  revenue: number;
}

export interface RecentOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface SalesReport {
  period: ReportPeriod;
  dateRange: DateRange;
  summary: SalesSummary;
  salesChart: SalesDataPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrderRow[];
}
