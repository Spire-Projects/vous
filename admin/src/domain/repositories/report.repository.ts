import type {
  SalesReport,
  ReportPeriod,
  DateRange,
} from "@/domain/entities/report.entity";

export interface ReportRepository {
  getSalesReport(period: ReportPeriod, range?: DateRange): Promise<SalesReport>;
}
