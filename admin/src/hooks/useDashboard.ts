import { useMemo } from "react";
import { useReports } from "./useReports";
import { useCustomers } from "./useCustomers";
import { useOrders } from "./useOrders";
import type { SalesReport } from "@/domain/entities/report.entity";
import type { Customer } from "@/domain/entities/user.entity";
import type { Order } from "@/domain/entities/order.entity";

export interface DashboardData {
  report: SalesReport | null;
  customers: Customer[];
  recentOrders: Order[];
  revenueBreakdown: {
    b2c: number;
    b2b: number;
    total: number;
    b2cPct: number;
    b2bPct: number;
  };
  loading: boolean;
  error: string | null;
}

const COUNTABLE_STATUSES = ["confirmed", "preparing", "shipped", "delivered"];

export function useDashboard(): DashboardData {
  const { report, loading: reportLoading, error } = useReports();
  const { customers, loading: customersLoading } = useCustomers();
  const { orders } = useOrders();

  const revenueBreakdown = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    from.setHours(0, 0, 0, 0);

    let b2c = 0;
    let b2b = 0;

    for (const order of orders) {
      if (!order.createdAt || !COUNTABLE_STATUSES.includes(order.status)) continue;
      if (new Date(order.createdAt) < from) continue;
      if (order.isWholesale) {
        b2b += order.total ?? 0;
      } else {
        b2c += order.total ?? 0;
      }
    }

    const total = b2c + b2b;
    return {
      b2c,
      b2b,
      total,
      b2cPct: total > 0 ? Math.round((b2c / total) * 100) : 0,
      b2bPct: total > 0 ? Math.round((b2b / total) * 100) : 0,
    };
  }, [orders]);

  return {
    report,
    customers,
    recentOrders: orders,
    revenueBreakdown,
    loading: reportLoading || customersLoading,
    error,
  };
}
