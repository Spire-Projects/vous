"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/useBanners";
import { HeroBannerSlide } from "./HeroBannerSlide";
import { HeroBannerOverlay } from "./HeroBannerOverlay";
import type { Banner } from "@/domain/entities/banner.entity";

const FALLBACK_BANNERS: Banner[] = [
  {
    id: "fallback",
    imageUrl: "",
    title: "VOUS",
    subtitle: "Moda contemporánea y piezas exclusivas.",
    ctaText: "Ver Todo",
    ctaUrl: "/catalogo",
    ctaVisible: true,
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

  const bannerHref = banner.categorySlug
    ? `/catalogo?categoria=${banner.categorySlug}`
    : banner.ctaUrl || "/catalogo";

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
      <section className="bg-black min-h-[70vh] flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative w-full bg-black overflow-hidden vous-hero-aspect">
      <style>{`
        .vous-hero-aspect { aspect-ratio: 3 / 4; min-height: 60vh; }
        @media (min-width: 641px) and (max-width: 1024px) {
          .vous-hero-aspect { aspect-ratio: 4 / 3; min-height: 70vh; }
        }
        @media (min-width: 1025px) {
          .vous-hero-aspect { aspect-ratio: 16 / 9; min-height: 80vh; }
        }
      `}</style>

      <AnimatePresence mode="wait">
        <HeroBannerSlide key={banner.id} banner={banner} />
      </AnimatePresence>

      <Link
        href={bannerHref}
        className="absolute inset-0 z-0"
        aria-label={banner.title || "Ver catálogo"}
      />

      <HeroBannerOverlay banner={banner} bannerHref={bannerHref} />

      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-[2px] rounded-full transition-all duration-300 ${
                  idx === current ? "w-8 bg-vous-gold" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
