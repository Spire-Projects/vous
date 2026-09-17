import { Mail, Phone, MapPin } from "lucide-react";
import type { SiteConfig } from "@/domain/entities/site-config.entity";

interface NosotrosScheduleContactProps {
  config: SiteConfig | null;
  whatsappHref: string;
}

function buildMapsEmbedUrl(url: string): string | null {
  if (!url) return null;
  const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
}

export function NosotrosScheduleContact({ config, whatsappHref }: NosotrosScheduleContactProps) {
  const addressLine = config?.address;
  const city = config?.city;
  const email = config?.email;
  const whatsappNumber = config?.whatsappNumber;
  const googleMapsUrl = config?.googleMapsUrl;
  const schedule = config?.schedule?.length ? config.schedule : [];
  const extendedSchedules = config?.extendedSchedules?.length ? config.extendedSchedules : [];
  const mapsEmbedUrl = googleMapsUrl ? buildMapsEmbedUrl(googleMapsUrl) : null;

  return (
    <section className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
      <div className="grid grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 md:col-span-5">
          <h2 className="font-serif text-[28px] md:text-4xl text-black mb-10">
            Horarios de Atención
          </h2>
          <div className="space-y-10">
            {extendedSchedules.length > 0 ? (
              extendedSchedules.map((ext) => (
                <div key={ext.title}>
                  <h4 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-4 border-b border-black/10 pb-2">
                    {ext.title}
                  </h4>
                  <ul className="space-y-2 font-sans text-sm text-black/50">
                    {ext.days.map(({ day, hours }) => (
                      <li key={day} className="flex justify-between">
                        <span>{day}</span>
                        <span className="text-black">{hours || "Cerrado"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : schedule.length > 0 ? (
              <div>
                <h4 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-4 border-b border-black/10 pb-2">
                  Atención al Cliente
                </h4>
                <ul className="space-y-2 font-sans text-sm text-black/50">
                  {schedule.map(({ day, hours }) => (
                    <li key={day} className="flex justify-between">
                      <span>{day}</span>
                      <span className="text-black">{hours || "Cerrado"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="font-sans text-sm text-black/50">
                Consultá nuestros horarios por WhatsApp.
              </p>
            )}
            <div>
              <h4 className="font-nav text-[10px] tracking-[0.2em] uppercase text-black mb-4 border-b border-black/10 pb-2">
                Atención en Horario Continuo para Ambos
              </h4>
              <p className="font-sans text-sm text-black/50">
                Atención en horario continuo para compras por menor y por mayor.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 mt-12 md:mt-0">
          <h2 className="font-serif text-[28px] md:text-4xl text-black mb-10">
            Ubicación &amp; Contacto
          </h2>
          {addressLine && (
            <div className="flex items-start gap-3 mb-6">
              <MapPin size={20} strokeWidth={1.2} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm text-black">{addressLine}</p>
                {city && <p className="font-sans text-xs text-black/50">{city}</p>}
              </div>
            </div>
          )}
          <div className="space-y-4 mb-8">
            {email && (
              <div className="flex items-center gap-3">
                <Mail size={18} strokeWidth={1.2} className="text-black" />
                <a
                  href={`mailto:${email}`}
                  className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                >
                  {email}
                </a>
              </div>
            )}
            {whatsappNumber && (
              <div className="flex items-center gap-3">
                <Phone size={18} strokeWidth={1.2} className="text-black" />
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-black/50 hover:text-black transition-colors"
                >
                  +{whatsappNumber}
                </a>
              </div>
            )}
          </div>
          <div className="relative aspect-video bg-white border border-black/10 overflow-hidden">
            {mapsEmbedUrl ? (
              <iframe
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de VOUS"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin size={40} strokeWidth={1} className="text-black mx-auto mb-4" />
                  <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-black/50">
                    Visualizar Mapa
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
