import Link from "next/link";
import type { Product } from "@/domain/entities/product.entity";
import { proxyCldUrl } from "@/utils/proxyCldUrl";

export function ProductCard({
  slug,
  name,
  categoryName,
  price,
  badge,
  images,
  isDiscounted,
  discountPercentage,
}: Product) {
  const coverImage = images?.[0];
  const formattedPrice = `Bs. ${price.toLocaleString("es-BO")}`;
  const discountedPrice =
    isDiscounted && discountPercentage
      ? `Bs. ${Math.round(price * (1 - discountPercentage / 100)).toLocaleString("es-BO")}`
      : null;

  return (
    <Link href={`/producto/${slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-vous-soft-black mb-4">
        {coverImage ? (
          <img
            src={proxyCldUrl(coverImage)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#2a2015] to-[#1a1a18]" />
        )}
        {badge && (
          <span className="absolute top-3 left-3 font-nav text-[10px] font-semibold tracking-[0.15em] bg-vous-gold text-vous-soft-black px-2 py-1 z-10">
            {badge}
          </span>
        )}
        {isDiscounted && discountPercentage && (
          <span className="absolute top-3 right-3 font-nav text-[10px] font-semibold tracking-[0.12em] bg-red-600 text-white px-2 py-1 z-10">
            -{discountPercentage}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-vous-soft-black/0 group-hover:bg-vous-soft-black/60 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2">
            Vista Rápida
          </span>
        </div>
      </div>
      <p className="font-nav text-[10px] tracking-[0.15em] uppercase text-vous-gray mb-1">
        {categoryName}
      </p>
      <h3 className="font-serif text-lg text-vous-soft-black group-hover:text-vous-gold transition-colors leading-tight">
        {name}
      </h3>
      <div className="flex items-center gap-2 mt-1">
        {discountedPrice ? (
          <>
            <p className="font-sans text-sm text-vous-soft-black font-medium">{discountedPrice}</p>
            <p className="font-sans text-xs text-vous-gray line-through">{formattedPrice}</p>
          </>
        ) : (
          <p className="font-sans text-sm text-vous-gray">{formattedPrice}</p>
        )}
      </div>
    </Link>
  );
}
