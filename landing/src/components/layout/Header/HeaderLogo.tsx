"use client";

import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function HeaderLogo() {
  const { config } = useSiteConfig();
  const storeName = config?.storeName ?? "VOUS";
  const logoUrl = config?.logoUrl;

  return (
    <Link
      href="/"
      className="flex items-center font-serif text-2xl font-bold tracking-[0.08em] text-vous-soft-black hover:text-vous-gold transition-colors duration-200"
      aria-label={`${storeName} — Inicio`}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={storeName} className="h-8 w-auto object-contain" />
      ) : (
        storeName
      )}
    </Link>
  );
}
