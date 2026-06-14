"use client";

import dynamic from "next/dynamic";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { FAQSection } from "@/app/(main)/nosotros/FAQSection";
import {
  NosotrosHero,
  NosotrosHistoria,
  NosotrosPilares,
  NosotrosScheduleContact,
  NosotrosCta,
} from "@/components/nosotros";

const NosotrosMap = dynamic(
  () => import("@/components/nosotros/NosotrosMap").then((mod) => mod.NosotrosMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-white animate-pulse rounded-2xl flex items-center justify-center">
        <span className="font-nav text-[11px] uppercase tracking-[0.2em] text-black/50">Cargando mapa...</span>
      </div>
    ),
  }
);

export function NosotrosPage() {
  const { config } = useSiteConfig();

  const storeName = config?.storeName ?? "VOUS";
  const whatsappNumber = config?.whatsappNumber ?? "";
  const whatsappMessage = config?.whatsappMessage ?? "";
  const whatsappHref = buildWhatsAppHref(whatsappNumber, whatsappMessage);
  const departmentLinks = config?.departmentLinks ?? [];
  const otherCountryLinks = config?.otherCountryLinks ?? [];

  return (
    <>
      <NosotrosHero storeName={storeName} />
      <NosotrosHistoria storeName={storeName} />
      <NosotrosPilares />
      <NosotrosScheduleContact config={config} whatsappHref={whatsappHref} />
      <section className="bg-white border-y border-black/10 py-12 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-20">
          <div className="mb-14 text-center">
            <span className="font-nav text-[10px] tracking-[0.25em] uppercase text-black mb-3 block">
              Puntos Oficiales
            </span>
            <h2 className="font-serif text-[28px] md:text-[42px] text-black">
              Encuentra tu tienda más cercana
            </h2>
            <p className="font-sans text-sm text-black/50 mt-3">
              Selecciona un departamento en el mapa para ver los puntos de venta oficiales.
            </p>
          </div>
          <NosotrosMap departmentLinks={departmentLinks} otherCountryLinks={otherCountryLinks} />
        </div>
      </section>
      <FAQSection />
      <NosotrosCta />
    </>
  );
}
