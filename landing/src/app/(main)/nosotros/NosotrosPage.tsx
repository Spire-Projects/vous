"use client";

import { Diamond, Users, BadgeCheck, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { FAQSection } from "@/components/home/FAQSection";

const VALUES = [
  {
    icon: Diamond,
    title: "Exclusividad",
    desc: "Producciones limitadas y diseños únicos que garantizan que cada prenda sea una pieza de colección personal.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad",
    desc: "Seleccionamos únicamente los materiales más nobles, desde sedas italianas hasta cueros tratados artesanalmente.",
  },
  {
    icon: Users,
    title: "Comunidad",
    desc: "Creamos espacios de diálogo para creativos, artistas y apasionados de la moda que comparten nuestra visión.",
  },
] as const;

export function NosotrosPage() {
  const { config } = useSiteConfig();

  const storeName = config?.storeName ?? "VOUS";
  const tagline = config?.tagline ?? "Moda urbana contemporánea";
  const email = config?.email;
  const whatsappNumber = config?.whatsappNumber;
  const whatsappMessage = config?.whatsappMessage;
  const whatsappHref = buildWhatsAppHref(whatsappNumber ?? "", whatsappMessage ?? "");
  const addressLine = config?.address;
  const city = config?.city;
  const googleMapsUrl = config?.googleMapsUrl;
  const schedule = config?.schedule?.length ? config.schedule : [];

  function buildMapsEmbedUrl(url: string): string | null {
    if (!url) return null;
    const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  }

  const mapsEmbedUrl = googleMapsUrl ? buildMapsEmbedUrl(googleMapsUrl) : null;

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
        <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-4 block">
          Nuestra Esencia
        </span>
        <h1 className="font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.08] text-vous-soft-black mb-8 max-w-3xl">
          Redefiniendo el Lujo Urbano.
        </h1>
        <p className="font-sans text-base md:text-lg text-vous-gray max-w-xl leading-relaxed">
          {storeName} no es solo una marca; es un manifiesto de estilo de vida para quienes encuentran la belleza en la simplicidad arquitectónica y la sofisticación de la calle.
        </p>
      </section>

      {/* Nuestra Historia */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="col-span-12 md:col-span-6 relative aspect-[3/4] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-vous-gray-light/30 to-vous-cream" />
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZBNb7diba5FyrcMnwT-70C7DIgk-L_6m77ZqvhVuXu2fBfaps1pwjvZ7xLzUtQucYb74AL1VJGk2jThYTgArHZiOOC7tCfPl2f3LB4ImKC44ixtz2VavPsDjdXCvKsFvHNN-yB_g-6gv_DDJzCRucfSEvz-rFUyQ8HEPmdsQSyCthysQ-pBtvfNDAfyHdnOXZKMFteanZj3xIbaCk99HrHtyGoQNEnw3I5Wi3xWwtW7UuQ2k9UDlKRUCHm7e94RE27QnJHCz_K2w"
              alt="VOUS - Moda urbana editorial"
              fill
              className="object-cover hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.165,0.84,0.44,1)]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 mt-10 md:mt-0">
            <h2 className="font-serif text-[28px] md:text-4xl text-vous-soft-black mb-8">
              Nuestra Historia
            </h2>
            <div className="space-y-5 font-sans text-sm md:text-base text-vous-gray leading-relaxed">
              <p>
                Nacimos en el corazón de la metrópolis, inspirados por la intersección entre la alta costura y el ritmo incesante de la ciudad. Lo que comenzó como un pequeño estudio de diseño experimental se ha transformado en un referente del lujo contemporáneo.
              </p>
              <p>
                Cada pieza de {storeName} es el resultado de un proceso meticuloso donde la artesanía tradicional se encuentra con una visión vanguardista. No creemos en temporadas, sino en piezas eternas que cuentan una historia de confianza y elegancia discreta.
              </p>
              <p>
                Hoy, {storeName} representa una comunidad global de visionarios que valoran la autenticidad por encima de las tendencias efímeras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares de Marca */}
      <section className="bg-vous-cream border-y border-vous-gray-light/40 py-12 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="mb-14 text-center">
            <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-vous-gold mb-3 block">
              Filosofía
            </span>
            <h2 className="font-serif text-[28px] md:text-[42px] text-vous-soft-black">
              Pilares de Marca
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-vous-gray-light/50 p-8 md:p-10 flex flex-col items-center text-center"
              >
                <Icon
                  size={32}
                  strokeWidth={1.2}
                  className="text-vous-gold mb-6"
                />
                <h3 className="font-serif text-2xl text-vous-soft-black mb-4">
                  {title}
                </h3>
                <p className="font-sans text-sm text-vous-gray leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horarios & Contacto */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-serif text-[28px] md:text-4xl text-vous-soft-black mb-10">
              Horarios de Atención
            </h2>
            <div className="space-y-8">
              {schedule.length > 0 ? (
                <div>
                  <h4 className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-soft-black mb-4 border-b border-vous-gray-light/40 pb-2">
                    Atención al Cliente
                  </h4>
                  <ul className="space-y-2 font-sans text-sm text-vous-gray">
                    {schedule.map(({ day, hours }) => (
                      <li key={day} className="flex justify-between">
                        <span>{day}</span>
                        <span className="text-vous-soft-black">{hours || "Cerrado"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="font-sans text-sm text-vous-gray">
                  Consultá nuestros horarios por WhatsApp.
                </p>
              )}
              <div>
                <h4 className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-soft-black mb-4 border-b border-vous-gray-light/40 pb-2">
                  Soporte Online
                </h4>
                <ul className="space-y-2 font-sans text-sm text-vous-gray">
                  <li className="flex justify-between">
                    <span>Atención 24/7</span>
                    <span className="text-vous-soft-black">Vía Chat &amp; Email</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Asesoría Privada</span>
                    <span className="text-vous-soft-black">Previa Cita</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 mt-12 md:mt-0">
            <h2 className="font-serif text-[28px] md:text-4xl text-vous-soft-black mb-10">
              Ubicación &amp; Contacto
            </h2>
            {addressLine && (
              <div className="flex items-start gap-3 mb-6">
                <MapPin
                  size={20}
                  strokeWidth={1.2}
                  className="text-vous-gold shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-sans text-sm text-vous-soft-black">
                    {addressLine}
                  </p>
                  {city && (
                    <p className="font-sans text-xs text-vous-gray">
                      {city}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-4 mb-8">
              {email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} strokeWidth={1.2} className="text-vous-gold" />
                  <a href={`mailto:${email}`} className="font-sans text-sm text-vous-gray hover:text-vous-gold transition-colors">
                    {email}
                  </a>
                </div>
              )}
              {whatsappNumber && (
                <div className="flex items-center gap-3">
                  <Phone size={18} strokeWidth={1.2} className="text-vous-gold" />
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-vous-gray hover:text-vous-gold transition-colors"
                  >
                    +{whatsappNumber}
                  </a>
                </div>
              )}
            </div>
            <div className="relative aspect-video bg-vous-cream border border-vous-gray-light/40 overflow-hidden">
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
                    <MapPin size={40} strokeWidth={1} className="text-vous-gold mx-auto mb-4" />
                    <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-vous-gray">
                      Visualizar Mapa
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes — desde Firestore "faqs" */}
      <FAQSection />

      {/* CTA Editorial */}
      <section className="max-w-3xl mx-auto px-5 md:px-20 py-16 md:py-28 text-center">
        <h2 className="font-serif text-2xl md:text-4xl text-vous-soft-black italic mb-6 leading-tight">
          &ldquo;El estilo es la respuesta a todo.&rdquo;
        </h2>
        <p className="font-sans text-sm md:text-base text-vous-gray mb-10">
          Descubrí nuestra última colección inspirada en el minimalismo industrial.
        </p>
        <Button asChild size="lg" className="tracking-[0.3em]">
          <Link href="/catalogo">Explorar Colección</Link>
        </Button>
      </section>
    </>
  );
}
