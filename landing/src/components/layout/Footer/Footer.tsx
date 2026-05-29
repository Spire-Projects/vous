"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { FooterLinks } from "./FooterLinks";
import { FooterSocial } from "./FooterSocial";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";

export function Footer() {
  const { config } = useSiteConfig();
  const year = new Date().getFullYear();

  const storeName = config?.storeName ?? "VOUS";
  const tagline =
    config?.tagline ??
    "Moda urbana contemporánea. Exclusividad, estilo y autenticidad en cada pieza.";
  const email = config?.email ?? "hola@vous.com.bo";
  const address = config?.address ?? "C. Esteban Arze 1355";
  const city = config?.city ?? "Cochabamba";
  const whatsappNumber = config?.whatsappNumber ?? "59165359595";
  const whatsappMessage = config?.whatsappMessage ?? "";
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);

  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ", " + city)}`
    : "#";

  return (
    <footer className="bg-vous-soft-black text-white">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-20 mb-12">
          {/* Brand */}
          <div className="space-y-4 max-w-[240px]">
            {config?.logoUrl ? (
              <Link href="/" className="block">
                <Image
                  src={config.logoUrl}
                  alt={storeName}
                  width={80}
                  height={32}
                  className="h-auto w-auto max-w-[80px]"
                  priority
                />
              </Link>
            ) : (
              <Link
                href="/"
                className="font-serif text-3xl font-bold tracking-[0.08em] text-white hover:text-vous-gold transition-colors"
              >
                {storeName}
              </Link>
            )}
            <p className="font-sans text-sm text-vous-gray-light leading-relaxed">{tagline}</p>

            {email && (
              <div>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 font-sans text-sm text-vous-gold hover:text-vous-gold-light transition-colors"
                >
                  <Mail size={14} />
                  {email}
                </a>
              </div>
            )}

            {whatsappNumber && (
              <div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-sm text-vous-gray-light hover:text-white transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            )}

            {address && (
              <div>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-sm text-vous-gray-light hover:text-white transition-colors"
                >
                  <MapPin size={14} />
                  {address}
                  {city ? `, ${city}` : ""}
                </a>
              </div>
            )}

            <FooterSocial />
          </div>

          {/* Links */}
          <FooterLinks />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[12px] text-vous-gray tracking-wide">
            © {year} {storeName}. Todos los derechos reservados.
          </p>
          <p className="font-sans text-[11px] text-vous-gray tracking-[0.1em]">
            BOLIVIA · LATINOAMÉRICA
          </p>
        </div>
      </div>
    </footer>
  );
}
