"use client";

import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function InstagramIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" />
    </svg>
  );
}

function UbicacionIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

const ICON_MAP = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  ubicacion: UbicacionIcon,
} as const;

export function FooterSocial() {
  const { config } = useSiteConfig();

  const networks = [
    { key: "instagram" as const, label: "Instagram", data: config?.instagram },
    { key: "tiktok" as const, label: "TikTok", data: config?.tiktok },
    { key: "ubicacion" as const, label: "Ubicación", data: config?.ubicacion },
  ];

  const activeNetworks = networks.filter((n) => n.data?.active && n.data?.url);

  if (activeNetworks.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {activeNetworks.map(({ key, label, data }) => {
        const Icon = ICON_MAP[key];
        return (
          <Link
            key={key}
            href={data!.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-all duration-300"
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}
