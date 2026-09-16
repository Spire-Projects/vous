import Link from "next/link";
import { motion } from "framer-motion";
import type { Banner } from "@/domain/entities/banner.entity";

interface HeroBannerOverlayProps {
  banner: Banner;
  bannerHref: string;
}

export function HeroBannerOverlay({ banner, bannerHref }: HeroBannerOverlayProps) {
  const hasText = Boolean(banner.title?.trim() || banner.subtitle?.trim());
  const showCta = banner.ctaVisible !== false;

  if (!hasText && !showCta) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 md:p-16 lg:p-24 pointer-events-none">
      <div className="max-w-2xl pointer-events-auto space-y-3 md:space-y-4">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block font-nav text-[9px] md:text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase border border-vous-gold/40 px-3 py-1 backdrop-blur-xs"
        >
          ESTILO | AUTENTICIDAD | EXCLUSIVIDAD
        </motion.span>

        {banner.title && (
          <motion.h1
            key={banner.id + "-title"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight uppercase leading-[1.05]"
          >
            {banner.title}
          </motion.h1>
        )}

        {banner.subtitle && (
          <motion.p
            key={banner.id + "-sub"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans text-xs sm:text-sm md:text-base text-white/80 max-w-lg leading-relaxed line-clamp-2"
          >
            {banner.subtitle}
          </motion.p>
        )}

        {showCta && (
          <motion.div
            key={banner.id + "-cta"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="pt-2 flex items-center gap-3 flex-wrap"
          >
            <Link
              href={bannerHref}
              className="inline-flex items-center gap-2 bg-vous-gold hover:bg-vous-gold-light text-vous-black font-nav text-[11px] md:text-[12px] font-semibold tracking-[0.2em] uppercase px-6 py-3 transition-colors shadow-lg"
            >
              {banner.ctaText || "VER TODO"}
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 border border-white/40 hover:border-white text-white font-nav text-[11px] md:text-[12px] font-medium tracking-[0.2em] uppercase px-6 py-3 transition-colors backdrop-blur-xs"
            >
              EXPLORAR
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
