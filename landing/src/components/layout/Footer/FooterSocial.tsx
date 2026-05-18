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

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

const ICON_MAP = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
} as const;

export function FooterSocial() {
  const { config } = useSiteConfig();

  const networks = [
    { key: "instagram" as const, label: "Instagram", data: config?.instagram },
    { key: "tiktok" as const, label: "TikTok", data: config?.tiktok },
    { key: "facebook" as const, label: "Facebook", data: config?.facebook },
    { key: "pinterest" as const, label: "Pinterest", data: config?.pinterest },
  ];

  const activeNetworks = networks.filter((n) => n.data?.active && n.data?.url);

  if (activeNetworks.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      {activeNetworks.map(({ key, label, data }) => {
        const Icon = ICON_MAP[key];
        return (
          <Link
            key={key}
            href={data!.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-8 h-8 rounded-full border border-vous-gold/30 flex items-center justify-center text-vous-gold hover:bg-vous-gold hover:text-vous-soft-black transition-all duration-200"
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}
