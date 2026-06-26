"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspect?: "video" | "square" | "3/4" | "auto";
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  imgClassName?: string;
  pauseOnHover?: boolean;
}

const ASPECT_CLASSES: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  "3/4": "aspect-[3/4]",
  auto: "",
};

export function ImageCarousel({
  images,
  alt,
  aspect = "video",
  interval = 2000,
  showDots = true,
  showArrows = false,
  className = "",
  imgClassName = "",
  pauseOnHover = true,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  const validImages = images.filter((img) => img && img.trim() !== "");
  const hasMultiple = validImages.length > 1;

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  useEffect(() => {
    if (!hasMultiple) return;
    if (pauseOnHover && hovered) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [hasMultiple, hovered, interval, next, pauseOnHover]);

  if (validImages.length === 0) {
    return (
      <div
        className={`relative overflow-hidden bg-black/5 ${ASPECT_CLASSES[aspect] ?? ""} ${className}`}
      />
    );
  }

  if (validImages.length === 1) {
    return (
      <div className={`relative overflow-hidden ${ASPECT_CLASSES[aspect] ?? ""} ${className}`}>
        <img
          src={proxyCldUrl(validImages[0])}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }

  const currentImage = validImages[index];

  return (
    <div
      className={`relative overflow-hidden ${ASPECT_CLASSES[aspect] ?? ""} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={currentImage + index}
          src={proxyCldUrl(currentImage)}
          alt={`${alt} ${index + 1}`}
          custom={direction}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        />
      </AnimatePresence>

      {/* Hover arrows */}
      {showArrows && hasMultiple && hovered && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <ChevronLeft size={16} className="text-black" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
          >
            <ChevronRight size={16} className="text-black" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && hasMultiple && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {validImages.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
