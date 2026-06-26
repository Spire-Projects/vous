"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Tag } from "lucide-react";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Product } from "@/domain/entities/product.entity";

interface CategoryDiscountsProps {
  categoryId: string;
  currentProductId: string;
  categorySlug?: string;
}

export function CategoryDiscounts({
  categoryId,
  currentProductId,
  categorySlug,
}: CategoryDiscountsProps) {
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    firestoreProductRepository
      .findByCategory(categoryId)
      .then((products) => {
        const withDiscount = products
          .filter(
            (p) =>
              p.id !== currentProductId &&
              p.isDiscounted &&
              p.discountPercentage &&
              p.discountPercentage > 0
          )
          .slice(0, 4);
        setDiscountedProducts(withDiscount);
      })
      .catch(() => setDiscountedProducts([]))
      .finally(() => setLoading(false));
  }, [categoryId, currentProductId]);

  if (!loading && discountedProducts.length === 0) return null;

  return (
    <section className="border-t border-black/10 pt-14 mt-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-[#C9A84C]" />
            <p className="font-nav text-[10px] tracking-[0.2em] uppercase text-[#C9A84C]">
              Ofertas en la categoría
            </p>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-black">Descuentos Especiales</h2>
        </div>
        <Link
          href={`/categoria/${categorySlug ?? categoryId}`}
          className="hidden md:flex items-center gap-1.5 font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors pb-0.5"
        >
          Ver más <ArrowRight size={12} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-black/5 mb-3" />
              <div className="h-4 bg-black/5 w-3/4 mb-2" />
              <div className="h-3 bg-black/5 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {discountedProducts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link href={`/producto/${p.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-3">
                  {p.images[0] ? (
                    <img
                      src={proxyCldUrl(p.images[0])}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-[#d4cfc6] to-[#b0a898]" />
                  )}
                  <span className="absolute top-3 right-3 font-nav text-[10px] font-semibold tracking-[0.12em] bg-red-600 text-white px-2.5 py-1">
                    -{p.discountPercentage}%
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-white border border-white/40 px-4 py-2 backdrop-blur-sm">
                      Ver Oferta
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors leading-tight">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-sans text-sm text-black font-medium">
                    Bs.{" "}
                    {(p.price * (1 - (p.discountPercentage ?? 0) / 100)).toLocaleString("es-BO", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="font-sans text-xs text-black/40 line-through">
                    Bs. {p.price.toLocaleString("es-BO")}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
