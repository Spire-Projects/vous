"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import type { ExtendedSchedule } from "@/domain/entities/site-config.entity";

const DEFAULT_SCHEDULES: ExtendedSchedule[] = [
  {
    title: "Compras por Menor",
    days: [
      { day: "Lunes", hours: "Cerrado" },
      { day: "Martes", hours: "8 am a 7 pm" },
      { day: "Miércoles", hours: "8 am a 7 pm" },
      { day: "Jueves", hours: "8 am a 7 pm" },
      { day: "Viernes", hours: "8 am a 7 pm" },
      { day: "Sábado", hours: "8 am a 7 pm" },
      { day: "Domingo", hours: "8 am a 7 pm" },
    ],
  },
  {
    title: "Compras por Mayor",
    days: [
      { day: "Lunes", hours: "Cerrado" },
      { day: "Martes", hours: "8 am a 7 pm" },
      { day: "Miércoles", hours: "5 am a 7 pm" },
      { day: "Jueves", hours: "8 am a 7 pm" },
      { day: "Viernes", hours: "8 am a 7 pm" },
      { day: "Sábado", hours: "5 am a 7 pm" },
      { day: "Domingo", hours: "8 am a 7 pm" },
    ],
  },
  {
    title: "Envíos Compras por Mayor",
    days: [
      { day: "Lunes", hours: "Cerrado" },
      { day: "Martes", hours: "10 am a 12 pm y 6 pm a 8 pm" },
      { day: "Miércoles", hours: "6 pm a 8 pm" },
      { day: "Jueves", hours: "10 am a 12 pm y 6 pm a 8 pm" },
      { day: "Viernes", hours: "10 am a 12 pm y 6 pm a 8 pm" },
      { day: "Sábado", hours: "6 pm a 8 pm" },
      { day: "Domingo", hours: "10 am a 12 pm y 6 pm a 8 pm" },
    ],
  },
];

export function ScheduleSection() {
  const { config } = useSiteConfig();

  const schedules = config?.extendedSchedules?.length
    ? config.extendedSchedules
    : DEFAULT_SCHEDULES;

  const whatsappNumber = config?.whatsappNumber ?? "59165359595";
  const whatsappMessage = config?.whatsappMessage ?? "";
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);

  return (
    <section className="bg-vous-warm-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          <div className="relative shrink-0 select-none">
            <p className="font-serif italic text-vous-gold text-2xl md:text-3xl mb-2 leading-none">
              horario de
            </p>
            <h2
              className="font-serif font-bold leading-none text-[clamp(4rem,14vw,9rem)] text-vous-gold"
              style={{ WebkitTextStroke: "0px" }}
            >
              ATENCIÓN
            </h2>
            <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-vous-gray mt-3">
              Atención en horario continuo
            </p>
          </div>

          <div className="flex-1 min-w-0 space-y-8">
            {schedules.map((ext) => (
              <div key={ext.title}>
                <h4 className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-soft-black mb-4 border-b border-vous-gray-light/40 pb-2">
                  {ext.title}
                </h4>
                <div className="divide-y divide-vous-gray-light/30">
                  {ext.days.map(({ day, hours }) => (
                    <div key={day} className="flex items-center justify-between py-3 gap-4">
                      <span className="font-nav text-[12px] font-semibold tracking-[0.2em] uppercase text-vous-soft-black">
                        {day}
                      </span>
                      <span className="font-nav text-[12px] tracking-[0.1em] text-vous-gold font-medium">
                        {hours || "Cerrado"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-nav text-[11px] tracking-[0.2em] uppercase text-vous-soft-black border border-vous-soft-black px-6 py-3 hover:bg-vous-soft-black hover:text-white transition-colors"
              >
                Contactar Asesora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
