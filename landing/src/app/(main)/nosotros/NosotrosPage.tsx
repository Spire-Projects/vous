"use client";

import { useSiteConfig } from "@/hooks/useSiteConfig";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { FAQSection } from "@/components/home/FAQSection";
import {
  NosotrosHero,
  NosotrosHistoria,
  NosotrosPilares,
  NosotrosScheduleContact,
  NosotrosLocations,
  NosotrosCta,
} from "@/components/nosotros";

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
      <NosotrosLocations departmentLinks={departmentLinks} otherCountryLinks={otherCountryLinks} />
      <FAQSection />
      <NosotrosCta />
    </>
  );
}
