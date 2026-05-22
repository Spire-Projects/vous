import { useEffect, useState, useCallback } from "react";
import { firestoreOrderRepository } from "@/infrastructure";
import { getSalesReport } from "@/application/use-cases/report/get-sales-report";
import type {
  SalesReport,
  ReportPeriod,
  DateRange,
} from "@/domain/entities/report.entity";

export function useReports() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(
    async (period: ReportPeriod, range?: DateRange) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSalesReport(
          firestoreOrderRepository,
          period,
          range,
        );
        setReport(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al generar reporte");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchReport("last_7_days");
  }, [fetchReport]);

  return { report, loading, error, fetchReport };
}
