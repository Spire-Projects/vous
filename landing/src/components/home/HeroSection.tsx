"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/hooks/useBanners";

const FALLBACK_BANNERS = [
  {
    id: "fallback",
    imageUrl: "",
    title: "VOUS",
    subtitle: "",
    ctaText: "",
    ctaUrl: "/catalogo",
    categorySlug: undefined,
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
    : "/catalogo";

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
      <section className="bg-black min-h-[92vh] flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[92vh] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id + "-img"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Link href={bannerHref} className="absolute inset-0 block" aria-label="Ver catálogo">
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#3d3d38] via-[#2a2a28] to-[#0a0a0a]" />
            )}
          </Link>

          {banner.imageUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>
        </>
      )}

      {/* Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-[2px] rounded-full transition-all duration-300 ${
                idx === current ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Ir al banner ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
