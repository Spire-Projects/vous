"use client";

import { useState, useRef, useMemo } from "react";
import type { MouseEvent, TouchEvent, RefObject } from "react";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { ProductColor } from "@/domain/entities/product.entity";

interface ProductGalleryProps {
  images: string[];
  name: string;
  colors?: ProductColor[];
  selectedColor?: string | null;
}

export function ProductGallery({ images, name, colors, selectedColor }: ProductGalleryProps) {
  const colorImages = useMemo(() => {
    if (!selectedColor || !colors) return null;
    const c = colors.find((c) => c.name === selectedColor);
    return c?.images && c.images.length > 0 ? c.images : null;
  }, [selectedColor, colors]);

  const displayImages = colorImages ?? images;
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);

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
      if (deltaX < 0) setActive((prev) => Math.min(prev + 1, displayImages.length - 1));
      else setActive((prev) => Math.max(prev - 1, 0));
    }
    touchStartX.current = null;
  }

  if (displayImages.length === 0) {
    return (
      <div className="flex-1">
        <div className="aspect-[3/4] bg-black/5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 flex-1">
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[640px] shrink-0 pb-1 md:pb-0">
        {displayImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ver imagen ${i + 1}`}
            aria-current={active === i ? true : undefined}
            className={`w-16 h-20 md:w-20 md:h-24 shrink-0 border-2 transition-colors overflow-hidden ${
              active === i ? "border-black" : "border-transparent hover:border-black/20"
            }`}
          >
            <img
              src={proxyCldUrl(img)}
              alt={`${name} ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div
        className="flex-1 aspect-[3/4] relative overflow-hidden bg-white cursor-zoom-in select-none"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef as RefObject<HTMLImageElement>}
          src={proxyCldUrl(displayImages[active])}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-150 ease-out"
          style={zoomed ? { transform: "scale(2)" } : undefined}
          draggable={false}
        />

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
