"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export function ScheduleSection() {
  const { config } = useSiteConfig();

  const schedule = config?.schedule?.length
    ? config.schedule
    : [
        { day: "Martes", hours: "9 am a 7 pm" },
        { day: "Miércoles", hours: "5 pm a 7 pm" },
        { day: "Jueves", hours: "9 am a 7 pm" },
        { day: "Viernes", hours: "9 am a 7 pm" },
        { day: "Sábado", hours: "5 pm a 7 pm" },
        { day: "Domingo", hours: "9 am a 7 pm" },
      ];

  const whatsappNumber = config?.whatsappNumber ?? "59165359595";
  const whatsappMessage = config?.whatsappMessage ?? "";
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);

  return (
    <section className="bg-vous-warm-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          {/* Left — large decorative title */}
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
          </div>

          {/* Right — schedule table */}
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-serif italic text-vous-gold text-lg mb-6">Continuo</p>

            <div className="divide-y divide-vous-gray-light/30">
              {schedule.map(({ day, hours }) => (
                <div key={day} className="flex items-center justify-between py-4 gap-4">
                  <span className="font-nav text-[13px] font-semibold tracking-[0.2em] uppercase text-vous-soft-black">
                    {day}
                  </span>
                  <span className="font-nav text-[13px] tracking-[0.1em] text-vous-gold font-medium">
                    {hours || "Cerrado"}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-6">
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
