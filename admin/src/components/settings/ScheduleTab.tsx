import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ExtendedSchedule } from "@/domain/entities/site-config.entity";

interface ScheduleTabProps {
  extendedSchedules: ExtendedSchedule[]; setExtendedSchedules: (v: ExtendedSchedule[]) => void;
}

export function ScheduleTab({
  extendedSchedules, setExtendedSchedules,
}: ScheduleTabProps) {
  function updateScheduleTitle(idx: number, title: string) {
    const next = [...extendedSchedules];
    next[idx] = { ...next[idx], title };
    setExtendedSchedules(next);
  }

  function updateDay(scheduleIdx: number, dayIdx: number, hours: string) {
    const next = [...extendedSchedules];
    const days = [...next[scheduleIdx].days];
    days[dayIdx] = { ...days[dayIdx], hours };
    next[scheduleIdx] = { ...next[scheduleIdx], days };
    setExtendedSchedules(next);
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-vous-text">Horarios de Atención</h2>
      <div className="space-y-8">
        {extendedSchedules.map((ext, sIdx) => (
          <div key={sIdx} className="border border-vous-border p-4 rounded-2xl">
            <div className="mb-3">
              <Label>Título del bloque</Label>
              <Input
                value={ext.title}
                onChange={(e) => updateScheduleTitle(sIdx, e.target.value)}
                placeholder="Ej. Compras por Menor"
              />
            </div>
            <div className="space-y-2">
              {ext.days.map((item, dIdx) => (
                <div key={item.day} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-3 items-center">
                  <span className="font-nav text-[11px] sm:text-[12px] uppercase tracking-wide text-vous-text">{item.day}</span>
                  <Input
                    value={item.hours}
                    onChange={(e) => updateDay(sIdx, dIdx, e.target.value)}
                    placeholder="Cerrado"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
