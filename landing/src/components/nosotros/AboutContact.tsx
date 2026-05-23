"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function buildWhatsAppHref(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "Hola, tengo una consulta");
  return `https://wa.me/${clean}?text=${encoded}`;
}

export function AboutContact() {
  const { config, loading } = useSiteConfig();

  const schedule = config?.schedule?.length
    ? config.schedule
    : [
        { day: "Lunes", hours: "Cerrado" },
        { day: "Martes", hours: "9 am a 7 pm" },
        { day: "Miércoles", hours: "5 am a 7 pm" },
        { day: "Jueves", hours: "9 am a 7 pm" },
        { day: "Viernes", hours: "9 am a 7 pm" },
        { day: "Sábado", hours: "5 am a 7 pm" },
        { day: "Domingo", hours: "9 am a 7 pm" },
      ];

  const address = config?.address ?? "C. Esteban Arze 1355-1313";
  const city = config?.city ?? "Cochabamba";
  const email = config?.email ?? "vous@gmail.com";
  const phone = config?.whatsappNumber ?? "+591 76435692";
  const whatsappHref = buildWhatsAppHref(
    config?.whatsappNumber ?? "+591 76435692",
    config?.whatsappMessage ?? ""
  );

  return (
    <section className="bg-vous-warm-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Hours */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black mb-10">
              Horarios de Atención
            </h2>

            <div className="space-y-8">
              <div>
                <h4 className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-soft-black uppercase mb-4 border-b border-vous-gray-light/40 pb-2">
                  BOUTIQUE FLAGSHIP
                </h4>
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-vous-gray-light/40 rounded w-3/4" />
                    <div className="h-4 bg-vous-gray-light/40 rounded w-2/3" />
                    <div className="h-4 bg-vous-gray-light/40 rounded w-1/2" />
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {schedule.map(({ day, hours }) => (
                      <li
                        key={day}
                        className="flex justify-between font-sans text-sm text-vous-gray"
                      >
                        <span>{day}</span>
                        <span>{hours || "Cerrado"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-soft-black uppercase mb-4 border-b border-vous-gray-light/40 pb-2">
                  SOPORTE ONLINE
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between font-sans text-sm text-vous-gray">
                    <span>Atención 24/7</span>
                    <span>Vía Chat & Email</span>
                  </li>
                  <li className="flex justify-between font-sans text-sm text-vous-gray">
                    <span>Asesoría Privada</span>
                    <span>Previa Cita</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact & Map */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-vous-soft-black mb-10">
              Ubicación & Contacto
            </h2>

            <div className="mb-10">
              <p className="font-sans text-lg text-vous-soft-black mb-1">{address}</p>
              <p className="font-sans text-sm text-vous-gray">{city}</p>

              <div className="mt-6 space-y-3">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 font-sans text-sm text-vous-gray hover:text-vous-gold transition-colors"
                >
                  <Mail size={18} strokeWidth={1.5} className="text-vous-gold" />
                  {email}
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-sans text-sm text-vous-gray hover:text-vous-gold transition-colors"
                >
                  <Phone size={18} strokeWidth={1.5} className="text-vous-gold" />
                  {phone}
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video bg-vous-cream flex items-center justify-center border border-vous-gray-light/40 relative overflow-hidden">
              <div className="text-center p-8">
                <MapPin size={40} strokeWidth={1.2} className="text-vous-gray mx-auto mb-4" />
                <p className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-gray uppercase">
                  Visualizar Mapa en Google Maps
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-vous-cream via-vous-gray-light/20 to-vous-cream opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
