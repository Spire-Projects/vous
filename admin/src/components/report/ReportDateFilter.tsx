import { useState } from "react";
import { Calendar, CalendarDays, CalendarRange, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReportPeriod, DateRange } from "@/domain/entities/report.entity";

const PERIOD_TABS: { label: string; value: ReportPeriod; icon: typeof Clock }[] = [
  { label: "Hoy", value: "today", icon: Clock },
  { label: "Últimos 7 días", value: "last_7_days", icon: Calendar },
  { label: "Últimos 30 días", value: "last_30_days", icon: CalendarDays },
  { label: "Este mes", value: "this_month", icon: CalendarRange },
];

interface ReportDateFilterProps {
  activePeriod: ReportPeriod;
  customRange?: DateRange;
  onChange: (period: ReportPeriod, range?: DateRange) => void;
}

export function ReportDateFilter({
  activePeriod,
  customRange,
  onChange,
}: ReportDateFilterProps) {
  const [showCustom, setShowCustom] = useState(activePeriod === "custom");
  const [from, setFrom] = useState(
    customRange?.from ? toInputDate(customRange.from) : "",
  );
  const [to, setTo] = useState(
    customRange?.to ? toInputDate(customRange.to) : "",
  );

  function applyCustom() {
    if (!from || !to) return;
    onChange("custom", { from: new Date(from), to: new Date(to) });
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex flex-wrap gap-1">
        {PERIOD_TABS.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            variant={activePeriod === tab.value ? "default" : "outline"}
            onClick={() => {
              setShowCustom(false);
              onChange(tab.value);
            }}
          >
            <tab.icon size={13} />
            {tab.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant={activePeriod === "custom" ? "default" : "outline"}
          onClick={() => setShowCustom((v) => !v)}
        >
          <Calendar size={13} className="mr-1" />
          Personalizado
        </Button>
      </div>

      {showCustom && (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-auto text-xs"
          />
          <span className="text-vous-text-secondary text-xs">hasta</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-auto text-xs"
          />
          <Button size="sm" onClick={applyCustom} disabled={!from || !to}>
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
}

function toInputDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
