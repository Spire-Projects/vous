import { motion } from "framer-motion";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Banner } from "@/domain/entities/banner.entity";

interface HeroBannerSlideProps {
  banner: Banner;
}

export function HeroBannerSlide({ banner }: HeroBannerSlideProps) {
  const desktopSrc = banner.imageUrl ? proxyCldUrl(banner.imageUrl) : "";
  const tabletSrc = banner.tabletImageUrl ? proxyCldUrl(banner.tabletImageUrl) : desktopSrc;
  const mobileSrc = banner.mobileImageUrl ? proxyCldUrl(banner.mobileImageUrl) : tabletSrc;
  const onlyDesktop = !banner.tabletImageUrl && !banner.mobileImageUrl;

  return (
    <motion.div
      key={banner.id + "-img"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      {desktopSrc ? (
        <picture>
          {banner.mobileImageUrl && <source media="(max-width: 640px)" srcSet={mobileSrc} />}
          {banner.tabletImageUrl && <source media="(max-width: 1024px)" srcSet={tabletSrc} />}
          <img
            src={desktopSrc}
            alt={banner.title || "VOUS"}
            className="absolute inset-0 w-full h-full object-cover vous-hero-img"
          />
        </picture>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d3d38] via-[#2a2a28] to-[#0a0a0a]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30 pointer-events-none" />

      {onlyDesktop && (
        <style>{`
          .vous-hero-img { object-position: center 25%; }
          @media (min-width: 641px) and (max-width: 1024px) {
            .vous-hero-img { object-position: center 30%; }
          }
          @media (min-width: 1025px) {
            .vous-hero-img { object-position: center center; }
          }
        `}</style>
      )}
    </motion.div>
  );
}
