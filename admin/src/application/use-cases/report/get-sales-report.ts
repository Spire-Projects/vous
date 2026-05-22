import type { ReportRepository } from "@/domain/repositories/report.repository";
import type {
  SalesReport,
  ReportPeriod,
  DateRange,
} from "@/domain/entities/report.entity";
import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order } from "@/domain/entities/order.entity";

function getDateRange(period: ReportPeriod, custom?: DateRange): DateRange {
  const now = new Date();
  const to = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  switch (period) {
    case "today": {
      const from = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
      );
      return { from, to };
    }
    case "last_7_days": {
      const from = new Date(to);
      from.setDate(from.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case "last_30_days": {
      const from = new Date(to);
      from.setDate(from.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    }
    case "this_month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      return { from, to };
    }
    case "custom":
      if (!custom) throw new Error("Rango personalizado requerido");
      return {
        from: new Date(
          custom.from.getFullYear(),
          custom.from.getMonth(),
          custom.from.getDate(),
          0,
          0,
          0,
        ),
        to: new Date(
          custom.to.getFullYear(),
          custom.to.getMonth(),
          custom.to.getDate(),
          23,
          59,
          59,
        ),
      };
    default:
      return { from: new Date(0), to };
  }
}

function getPreviousRange(range: DateRange): DateRange {
  const duration = range.to.getTime() - range.from.getTime();
  return {
    from: new Date(range.from.getTime() - duration),
    to: new Date(range.from.getTime() - 1),
  };
}

function isInRange(dateStr: string | undefined, range: DateRange): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d >= range.from && d <= range.to;
}

function countRevenue(orders: Order[]): number {
  return orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
}

function buildChart(
  orders: Order[],
  range: DateRange,
  period: ReportPeriod,
): import("@/domain/entities/report.entity").SalesDataPoint[] {
  const points = new Map<string, { revenue: number; orders: number }>();

  const fmtDay = (d: Date) =>
    d.toLocaleDateString("es-BO", { day: "2-digit", month: "short" });
  const fmtWeek = (d: Date) => {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `Sem ${start.getDate()}`;
  };
  const fmtMonth = (d: Date) =>
    d.toLocaleDateString("es-BO", { month: "short" });

  let labelFn: (d: Date) => string;
  if (period === "today") {
    labelFn = (d) => `${d.getHours()}:00`;
  } else if (period === "last_7_days" || period === "this_month") {
    labelFn = fmtDay;
  } else if (period === "last_30_days") {
    labelFn = fmtWeek;
  } else {
    labelFn = fmtDay;
  }

  for (const o of orders) {
    if (!o.createdAt) continue;
    const d = new Date(o.createdAt);
    const key = labelFn(d);
    const prev = points.get(key) ?? { revenue: 0, orders: 0 };
    prev.revenue += o.total ?? 0;
    prev.orders += 1;
    points.set(key, prev);
  }

  // Ensure all days in range appear with 0 values
  if (period !== "today") {
    const curr = new Date(range.from);
    while (curr <= range.to) {
      const key = labelFn(curr);
      if (!points.has(key)) points.set(key, { revenue: 0, orders: 0 });
      curr.setDate(curr.getDate() + 1);
    }
  }

  return Array.from(points.entries())
    .map(([label, { revenue, orders }]) => ({ label, revenue, orders }))
    .sort((a, b) => {
      // Sort by date if day labels
      const da = new Date(a.label + " 2026");
      const db = new Date(b.label + " 2026");
      if (!Number.isNaN(da.getTime()) && !Number.isNaN(db.getTime()))
        return da.getTime() - db.getTime();
      return a.label.localeCompare(b.label);
    });
}

function buildTopProducts(
  orders: Order[],
  limit = 5,
): import("@/domain/entities/report.entity").TopProduct[] {
  const map = new Map<
    string,
    {
      productName: string;
      imageUrl?: string;
      unitsSold: number;
      revenue: number;
    }
  >();

  for (const o of orders) {
    for (const item of o.items) {
      const prev = map.get(item.productId) ?? {
        productName: item.productName,
        imageUrl: item.imageUrl,
        unitsSold: 0,
        revenue: 0,
      };
      prev.unitsSold += item.quantity;
      prev.revenue += item.subtotal ?? item.unitPrice * item.quantity;
      map.set(item.productId, prev);
    }
  }

  return Array.from(map.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

function buildRecentOrders(
  orders: Order[],
  limit = 10,
): import("@/domain/entities/report.entity").RecentOrderRow[] {
  return orders.slice(0, limit).map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customer.name,
    total: o.total ?? 0,
    status: o.status,
    createdAt: o.createdAt ?? "",
  }));
}

const COUNTABLE_STATUSES: Order["status"][] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

export async function getSalesReport(
  orderRepo: OrderRepository,
  period: ReportPeriod,
  customRange?: DateRange,
): Promise<SalesReport> {
  const range = getDateRange(period, customRange);
  const allOrders = await orderRepo.findAll();

  const currentOrders = allOrders.filter(
    (o) =>
      COUNTABLE_STATUSES.includes(o.status) && isInRange(o.createdAt, range),
  );

  const prevRange = getPreviousRange(range);
  const prevOrders = allOrders.filter(
    (o) =>
      COUNTABLE_STATUSES.includes(o.status) &&
      isInRange(o.createdAt, prevRange),
  );

  const totalRevenue = countRevenue(currentOrders);
  const totalOrders = currentOrders.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const prevRevenue = countRevenue(prevOrders);
  const prevOrdersCount = prevOrders.length;

  const revenueChange =
    prevRevenue > 0
      ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
      : 0;
  const ordersChange =
    prevOrdersCount > 0
      ? Math.round(((totalOrders - prevOrdersCount) / prevOrdersCount) * 100)
      : 0;

  return {
    period,
    dateRange: range,
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: avgOrderValue,
      revenueChange,
      ordersChange,
    },
    salesChart: buildChart(currentOrders, range, period),
    topProducts: buildTopProducts(currentOrders),
    recentOrders: buildRecentOrders(currentOrders),
  };
}
