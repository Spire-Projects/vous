"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function buildWhatsAppHref(number: string, message: string): string {
  const clean = number.replace(/\D/g, "");
  const encoded = encodeURIComponent(message || "Hola, tengo una consulta");
  return `https://wa.me/${clean}?text=${encoded}`;
}

export default function ContactoPage() {
  const { config, loading } = useSiteConfig();

  const address = config?.address ?? "C. Esteban Arze 1355-1313";
  const city = config?.city ?? "Cochabamba";
  const email = config?.email ?? "vous@gmail.com";
  const phone = config?.whatsappNumber ?? "+591 76435692";
  const whatsappHref = buildWhatsAppHref(
    config?.whatsappNumber ?? "+591 76435692",
    config?.whatsappMessage ?? ""
  );

  return (
    <section className="bg-vous-warm-white min-h-[60vh]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black mb-6">
            Contacto
          </h1>
          <p className="font-sans text-base text-vous-gray mb-14 leading-relaxed">
            Estamos aquí para ayudarte. Escríbenos por cualquiera de nuestros canales.
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-vous-gray-light/40 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Address */}
              <div className="p-8 border border-vous-gray-light/30 bg-white">
                <MapPin size={28} strokeWidth={1.2} className="text-vous-gold mb-5" />
                <h3 className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-soft-black uppercase mb-3">
                  Dirección
                </h3>
                <p className="font-sans text-sm text-vous-gray leading-relaxed">
                  {address}
                  <br />
                  {city}
                </p>
              </div>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="p-8 border border-vous-gray-light/30 bg-white hover:border-vous-gold transition-colors group"
              >
                <Mail size={28} strokeWidth={1.2} className="text-vous-gold mb-5" />
                <h3 className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-soft-black uppercase mb-3">
                  Correo
                </h3>
                <p className="font-sans text-sm text-vous-gray leading-relaxed group-hover:text-vous-gold transition-colors">
                  {email}
                </p>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-8 border border-vous-gray-light/30 bg-white hover:border-vous-gold transition-colors group"
              >
                <Phone size={28} strokeWidth={1.2} className="text-vous-gold mb-5" />
                <h3 className="font-nav text-[11px] font-semibold tracking-[0.2em] text-vous-soft-black uppercase mb-3">
                  WhatsApp
                </h3>
                <p className="font-sans text-sm text-vous-gray leading-relaxed group-hover:text-vous-gold transition-colors">
                  {phone}
                </p>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
