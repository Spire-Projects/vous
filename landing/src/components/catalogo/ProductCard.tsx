import Link from "next/link";
import type { Product } from "@/domain/entities/product.entity";
import type { UserRole } from "@/types/auth.types";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import { calculateFinalPrice } from "@/utils/calculate-price";
import { WholesaleWatermark } from "@/components/shared/WholesaleWatermark";

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
  isDiscounted,
  discountPercentage,
  isPreorder,
  isSpecialCollection,
  isBestseller,
  wholesaleOnly,
  userRole,
  userUid,
}: ProductCardProps) {
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

  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-3">
        {coverImage ? (
          <img
            src={proxyCldUrl(coverImage)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#2a2a28] to-[#1a1a18]" />
        )}
        {badge && (
          <span className="absolute top-3 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2 py-1 z-10">
            {badge}
          </span>
        )}
        {!badge && isPreorder && (
          <span className="absolute top-3 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2 py-1 z-10">
            Preventa
          </span>
        )}
        {!badge && !isPreorder && isSpecialCollection && (
          <span className="absolute top-3 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2 py-1 z-10">
            Col. Especial
          </span>
        )}
        {isBestseller && (
          <span className="absolute bottom-10 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-black text-white px-2 py-1 z-10">
            Más Vendido
          </span>
        )}
        {isDiscounted && discountPercentage && (
          <span className="absolute top-3 right-3 font-nav text-[10px] font-semibold tracking-[0.12em] bg-black text-white px-2 py-1 z-10">
            -{discountPercentage}%
          </span>
        )}
        {wholesaleOnly && isWholesaler && userUid && <WholesaleWatermark userUid={userUid} />}
        {wholesaleOnly && !isWholesaler && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <span className="font-nav text-[10px] tracking-[0.2em] uppercase text-white/80 border border-white/30 px-3 py-1.5">
              Exclusivo Mayorista
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2">
            Vista Rápida
          </span>
        </div>
      </div>
      <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
        {categoryName}
      </p>
      <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors duration-300 leading-tight">
        {name}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        {originalPriceLabel ? (
          <>
            <p className="font-sans text-sm text-black font-medium">{finalPriceLabel}</p>
            <p className="font-sans text-xs text-black/40 line-through">{originalPriceLabel}</p>
          </>
        ) : (
          <p className="font-sans text-sm text-black font-medium">{finalPriceLabel}</p>
        )}
        {isWholesaler && pricing.discountLabel && (
          <span className="font-nav text-[10px] tracking-wider text-black/60 ml-1">
            {pricing.discountLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
