"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/domain/entities/product.entity";
import type { UserRole } from "@/types/auth.types";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import { calculateFinalPrice } from "@/utils/calculate-price";
import { WholesaleWatermark } from "@/components/shared/WholesaleWatermark";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps extends Product {
  userRole?: UserRole | null;
  userUid?: string;
}

export function ProductCard({
  slug,
  name,
  categoryName,
  price,
  wholesalePrice,
  badge,
  images,
  colors,
  isDiscounted,
  discountPercentage,
  isPreorder,
  isSpecialCollection,
  isBestseller,
  wholesaleOnly,
  userRole,
  userUid,
}: ProductCardProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const coverImage = images?.[0];
  const isWholesaler = userRole === "wholesaler";

  const pricing = calculateFinalPrice(
    { price, wholesalePrice, isDiscounted, discountPercentage },
    { role: isWholesaler ? "wholesale" : "customer" }
  );

  const finalPriceLabel = `Bs. ${pricing.finalPrice.toLocaleString("es-BO")}`;
  const originalPriceLabel = pricing.isDiscounted
    ? `Bs. ${pricing.originalPrice.toLocaleString("es-BO")}`
    : null;

  // Determine visible image based on hovered color
  const activeImage = useCallback(() => {
    if (hoveredColor && colors) {
      const colorObj = colors.find((c) => c.name === hoveredColor);
      if (colorObj?.images && colorObj.images.length > 0) {
        return colorObj.images[0];
      }
    }
    // Fallback to second image on hover if no color selected
    if (isHovered && images && images.length > 1 && !hoveredColor) {
      return images[1];
    }
    return coverImage;
  }, [hoveredColor, colors, images, coverImage, isHovered])();

  // Unique colors with images for preview strip
  const previewColors = colors?.filter(
    (c) => c.images && c.images.length > 0
  ) ?? [];

  // Also show color swatches even if they don't have dedicated images
  const colorSwatches = colors ?? [];

  return (
    <Link
      href={`/producto/${slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredColor(null);
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-3">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={proxyCldUrl(activeImage ?? coverImage ?? "")}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {badge && (
            <span className="font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2.5 py-1">
              {badge}
            </span>
          )}
          {!badge && isPreorder && (
            <span className="font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2.5 py-1">
              Preventa
            </span>
          )}
          {!badge && !isPreorder && isSpecialCollection && (
            <span className="font-nav text-[10px] font-semibold tracking-[0.15em] bg-[#C9A84C] text-white px-2.5 py-1">
              Col. Especial
            </span>
          )}
        </div>

        {isBestseller && (
          <span className="absolute bottom-14 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2.5 py-1 z-10">
            Más Vendido
          </span>
        )}

        {isDiscounted && discountPercentage && (
          <span className="absolute top-3 right-3 font-nav text-[10px] font-semibold tracking-[0.12em] bg-red-600 text-white px-2.5 py-1 z-10">
            -{discountPercentage}%
          </span>
        )}

        {wholesaleOnly && isWholesaler && userUid && (
          <WholesaleWatermark userUid={userUid} />
        )}
        {wholesaleOnly && !isWholesaler && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <span className="font-nav text-[10px] tracking-[0.2em] uppercase text-white/80 border border-white/30 px-3 py-1.5">
              Exclusivo Mayorista
            </span>
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-x-0 bottom-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 z-10">
          <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2 backdrop-blur-sm">
            Vista Rápida
          </span>
        </div>

        {/* Color preview thumbnails on hover (Adidas style) */}
        {colorSwatches.length > 1 && (
          <div
            className={`absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-1.5 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {colorSwatches.slice(0, 5).map((c) => (
              <button
                key={c.name}
                type="button"
                onMouseEnter={(e) => {
                  e.preventDefault();
                  setHoveredColor(c.name);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  setHoveredColor(null);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  hoveredColor === c.name
                    ? "border-white shadow-lg"
                    : "border-white/60"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
              />
            ))}
            {colorSwatches.length > 5 && (
              <span className="text-[10px] text-white font-sans bg-black/50 px-1.5 py-0.5 rounded">
                +{colorSwatches.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Image dots for non-color products with multiple images */}
        {colorSwatches.length <= 1 && images && images.length > 1 && (
          <div
            className={`absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {images.slice(0, 4).map((_, idx) => (
              <span
                key={idx}
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  (isHovered && idx === 1) || (!isHovered && idx === 0)
                    ? "bg-white"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
        {categoryName}
      </p>
      <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors duration-300 leading-tight mb-1">
        {name}
      </h3>
      <div className="flex items-center gap-2">
        {originalPriceLabel ? (
          <>
            <p className="font-sans text-sm text-black font-medium">
              {finalPriceLabel}
            </p>
            <p className="font-sans text-xs text-black/40 line-through">
              {originalPriceLabel}
            </p>
          </>
        ) : (
          <p className="font-sans text-sm text-black font-medium">
            {finalPriceLabel}
          </p>
        )}
        {isWholesaler && pricing.discountLabel && (
          <span className="font-nav text-[10px] tracking-wider text-black/60 ml-1">
            {pricing.discountLabel}
          </span>
        )}
      </div>

      {/* Mini color dots below price (always visible if multiple colors) */}
      {colorSwatches.length > 1 && (
        <div className="flex items-center gap-1 mt-2">
          {colorSwatches.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="w-3 h-3 rounded-full border border-black/10"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {colorSwatches.length > 4 && (
            <span className="text-[10px] text-black/40 font-sans">
              +{colorSwatches.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
