"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBanners } from "@/hooks/useBanners";

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

  // Auto-advance every 6s when multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length, next]);

  if (loading) {
    return (
      <section className="bg-vous-soft-black min-h-[92vh] flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="bg-vous-soft-black min-h-[92vh] flex flex-col md:flex-row overflow-hidden relative">
      {/* Left — text content */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:py-0 md:w-1/2 z-10">
        <span className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase border border-vous-gold/40 px-4 py-1.5 self-start mb-8">
          ESTILO | AUTENTICIDAD | EXCLUSIVIDAD
        </span>

        <AnimatePresence mode="wait">
          <motion.h1
            key={banner.id + "-title"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold text-white leading-[1.0] tracking-[-0.02em] mb-6 whitespace-pre-line"
          >
            {banner.title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={banner.id + "-subtitle"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-sans text-base text-white/70 max-w-sm mb-10 leading-relaxed"
          >
            {banner.subtitle}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id + "-cta"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <Button variant="gold" size="default" asChild>
              <Link href={banner.ctaUrl || "/catalogo"}>{banner.ctaText || "VER TODO"}</Link>
            </Button>
            <Button variant="outline-white" size="default" asChild>
              <Link href="/catalogo">EXPLORAR</Link>
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* Dots + Arrows */}
        {activeBanners.length > 1 && (
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={prev}
              className="text-white/50 hover:text-vous-gold transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === current ? "bg-vous-gold" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Ir al banner ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="text-white/50 hover:text-vous-gold transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Right — image */}
      <div className="relative md:w-1/2 min-h-[50vw] md:min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id + "-img"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {banner.imageUrl ? (
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e15] via-[#2a2015] to-[#0d0d0b]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/60 via-transparent to-transparent" />
            <div
              className="absolute inset-0 opacity-10 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
