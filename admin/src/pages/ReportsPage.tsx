import { TrendingUp, ShoppingBag, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ReportDateFilter } from "@/components/report/ReportDateFilter";
import { SalesChart } from "@/components/report/SalesChart";
import { TopProductsTable } from "@/components/report/TopProductsTable";
import { RecentOrdersTable } from "@/components/report/RecentOrdersTable";
import { useReports } from "@/hooks/useReports";
import { formatCurrency } from "@/utils";
import type { ReportPeriod, DateRange } from "@/domain/entities/report.entity";

export function ReportsPage() {
  const { report, loading, error, fetchReport } = useReports();

  function handleFilterChange(period: ReportPeriod, range?: DateRange) {
    void fetchReport(period, range);
  }

  return (
    <div className="p-8 space-y-6">
      <PageHeader
        title="Reportes y Estadísticas"
        subtitle="Monitorea el rendimiento comercial de VOUS con métricas actualizadas."
      />

      <ReportDateFilter
        activePeriod={report?.period ?? "last_7_days"}
        customRange={report?.dateRange}
        onChange={handleFilterChange}
      />

      {loading && (
        <div className="flex justify-center py-20">
          <span className="inline-block w-5 h-5 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="py-16 text-center">
          <p className="text-sm text-red-600 font-nav">{error}</p>
        </div>
      )}

      {!loading && !error && report && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Ingresos totales"
              value={formatCurrency(report.summary.totalRevenue)}
              change={
                report.summary.revenueChange !== 0
                  ? `${report.summary.revenueChange > 0 ? "+" : ""}${report.summary.revenueChange}% vs período anterior`
                  : undefined
              }
              isPositive={report.summary.revenueChange >= 0}
              icon={<TrendingUp size={18} />}
            />
            <StatCard
              label="Pedidos confirmados"
              value={String(report.summary.totalOrders)}
              change={
                report.summary.ordersChange !== 0
                  ? `${report.summary.ordersChange > 0 ? "+" : ""}${report.summary.ordersChange}% vs período anterior`
                  : undefined
              }
              isPositive={report.summary.ordersChange >= 0}
              icon={<ShoppingBag size={18} />}
            />
            <StatCard
              label="Ticket promedio"
              value={formatCurrency(report.summary.averageOrderValue)}
              icon={<Receipt size={18} />}
            />
          </div>

          {/* Chart */}
          <div className="bg-vous-white border border-vous-border p-6">
            <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-black mb-4">
              Ventas por período
            </h3>
            <SalesChart data={report.salesChart} />
          </div>

          {/* Tables row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-vous-white border border-vous-border p-6">
              <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-black mb-4">
                Productos más vendidos
              </h3>
              <TopProductsTable products={report.topProducts} />
            </div>
            <div className="bg-vous-white border border-vous-border p-6">
              <h3 className="font-nav text-[13px] uppercase tracking-wider text-vous-black mb-4">
                Pedidos recientes
              </h3>
              <RecentOrdersTable orders={report.recentOrders} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
