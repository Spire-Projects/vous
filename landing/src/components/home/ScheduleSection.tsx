const SCHEDULE = [
  { day: "Martes", hours: "9 am a 7 pm" },
  { day: "Miércoles", hours: "5 pm a 7 pm" },
  { day: "Jueves", hours: "9 am a 7 pm" },
  { day: "Viernes", hours: "9 am a 7 pm" },
  { day: "Sábado", hours: "5 pm a 7 pm" },
  { day: "Domingo", hours: "9 am a 7 pm" },
];

const WHATSAPP_HREF =
  "https://api.whatsapp.com/send?phone=59165359595&text=%E2%9C%A8%20Hola%2C%20soy%20*Luana*%2C%20tu%20asesora%20de%20moda%20%F0%9F%A4%8D%0A%0AEstoy%20aqu%C3%AD%20para%20ayudarte%20a%20encontrar%20tu%20outfit%20ideal%20%F0%9F%92%AB%0A%0APuedes%20escribirme%20por%3A%0A%F0%9F%91%97%20Modelos%20disponibles%0A%F0%9F%93%8F%20Tallas%0A%F0%9F%92%B0%20Precios%0A%F0%9F%9A%9A%20Env%C3%ADos%0A%F0%9F%9B%8D%EF%B8%8F%20Pedidos%0A%0ATambi%C3%A9n%20puedes%20enviarme%20una%20foto%20del%20modelo%20que%20te%20guste%20%F0%9F%92%95%0A%0A%E2%9C%A8%20Stock%20limitado%0A%0A";

export function ScheduleSection() {
  return (
    <section className="bg-vous-warm-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          {/* Left — large decorative title */}
          <div className="relative shrink-0 select-none">
            {/* Handwritten label */}
            <p className="font-serif italic text-vous-gold text-2xl md:text-3xl mb-2 leading-none">
              horario de
            </p>
            {/* Big block text */}
            <h2
              className="font-serif font-bold leading-none text-[clamp(4rem,14vw,9rem)] text-vous-gold"
              style={{ WebkitTextStroke: "0px" }}
            >
              ATENCIÓN
            </h2>
          </div>

          {/* Right — schedule table */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* "Continuo" badge */}
            <p className="font-serif italic text-vous-gold text-lg mb-6">Continuo</p>

            <div className="divide-y divide-vous-gray-light/30">
              {SCHEDULE.map(({ day, hours }) => (
                <div key={day} className="flex items-center justify-between py-4 gap-4">
                  <span className="font-nav text-[13px] font-semibold tracking-[0.2em] uppercase text-vous-soft-black">
                    {day}
                  </span>
                  <span className="font-nav text-[13px] tracking-[0.1em] text-vous-gold font-medium">
                    {hours}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-6">
              <a
                href={WHATSAPP_HREF}
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
