"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import type { MouseEvent, TouchEvent, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { ProductColor, ProductVariant } from "@/domain/entities/product.entity";

interface ProductGalleryProps {
  images: string[];
  name: string;
  colors?: ProductColor[];
  selectedColor?: string | null;
  selectedSize?: string | null;
  variants?: ProductVariant[];
}

export function ProductGallery({ images, name, colors, selectedColor, selectedSize, variants }: ProductGalleryProps) {
  const displayImages = useMemo(() => {
    // 1. Exact variant match (color + size)
    if (variants && variants.length > 0 && selectedColor && selectedSize) {
      const exact = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize && v.images && v.images.length > 0
      );
      if (exact?.images) return exact.images;
    }

    // 2. Any variant matching selected color
    if (variants && variants.length > 0 && selectedColor) {
      const colorVariants = variants.filter(
        (v) => v.color === selectedColor && v.images && v.images.length > 0
      );
      if (colorVariants.length > 0) {
        const imgs = colorVariants.flatMap((v) => v.images!);
        return [...new Set(imgs)];
      }
    }

    // 3. Any variant matching selected size
    if (variants && variants.length > 0 && selectedSize) {
      const sizeVariants = variants.filter(
        (v) => v.size === selectedSize && v.images && v.images.length > 0
      );
      if (sizeVariants.length > 0) {
        const imgs = sizeVariants.flatMap((v) => v.images!);
        return [...new Set(imgs)];
      }
    }

    // 4. Color images from product.colors
    if (selectedColor && colors) {
      const c = colors.find((c) => c.name === selectedColor);
      if (c?.images && c.images.length > 0) return c.images;
    }

    // 5. Default product images
    return images;
  }, [variants, selectedColor, selectedSize, colors, images]);

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
  }, [displayImages]);

  const changeImage = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > active ? 1 : -1);
      setActive(newIndex);
    },
    [active]
  );

  const goNext = useCallback(() => {
    if (active < displayImages.length - 1) {
      changeImage(active + 1);
    }
  }, [active, displayImages.length, changeImage]);

  const goPrev = useCallback(() => {
    if (active > 0) {
      changeImage(active - 1);
    }
  }, [active, changeImage]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  const motionVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  if (displayImages.length === 0) {
    return (
      <div className="flex-1">
        <div className="aspect-[3/4] bg-black/5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 flex-1">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[640px] shrink-0 pb-1 md:pb-0 no-scrollbar">
        {displayImages.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => changeImage(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={active === i ? true : undefined}
            className={`relative w-16 h-20 md:w-20 md:h-24 shrink-0 border-2 transition-colors overflow-hidden ${
              active === i ? "border-black" : "border-transparent hover:border-black/20"
            }`}
          >
            <img
              src={proxyCldUrl(img)}
              alt={`${name} ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {active === i && (
              <motion.div
                layoutId="gallery-thumb-indicator"
                className="absolute inset-0 border-2 border-black pointer-events-none"
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="flex-1 aspect-[3/4] relative overflow-hidden bg-white cursor-zoom-in select-none group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={`${displayImages[active]}-${active}`}
            ref={imgRef as RefObject<HTMLImageElement>}
            src={proxyCldUrl(displayImages[active])}
            alt={name}
            custom={direction}
            variants={motionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={zoomed ? { transform: "scale(2)" } : undefined}
            draggable={false}
          />
        </AnimatePresence>

        {/* Desktop arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={active === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              disabled={active === displayImages.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Mobile dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden pointer-events-none">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  i === active ? "bg-black" : "bg-black/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
