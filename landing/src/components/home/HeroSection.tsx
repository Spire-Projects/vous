"use client";

import { useState, useEffect, useCallback } from "react";
import { useBanners } from "@/hooks/useBanners";
import { HeroText } from "./HeroText";
import { HeroImage } from "./HeroImage";
import { HeroControls } from "./HeroControls";

const FALLBACK_BANNERS = [
  {
    id: "fallback",
    imageUrl: "",
    title: "TÚ NOS\nINSPIRAS",
    subtitle:
      "La perfección nunca nos inspiró. Nos inspira lo real. VOUS nace para quienes rompen moldes y crean su propia esencia.",
    ctaText: "VER TODO",
    ctaUrl: "/catalogo",
    active: true,
    order: 0,
    createdAt: new Date().toISOString(),
  },
];

export function HeroSection() {
  const { banners, loading } = useBanners();
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;
  const banner = activeBanners[current];

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length, next]);

  if (loading) {
    return (
      <section className="bg-vous-cream min-h-[800px] flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative bg-vous-cream min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Decorative V */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[80vh] leading-none pointer-events-none select-none z-0"
        style={{
          background: "linear-gradient(135deg, #D9BB96 0%, #A87B42 50%, #D9BB96 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: 0.05,
        }}
      >
        V
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-20 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left — text */}
          <div className="lg:col-span-5 flex flex-col items-start gap-8">
            <HeroText banner={banner} />
            <HeroControls
              total={activeBanners.length}
              current={current}
              onPrev={prev}
              onNext={next}
              onSelect={setCurrent}
            />
          </div>

          {/* Right — image */}
          <div className="lg:col-span-7 flex justify-end">
            <HeroImage imageUrl={banner.imageUrl} alt={banner.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
