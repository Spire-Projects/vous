"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { useAuthContext } from "@/context/AuthContext";
import { useTrendingProducts } from "@/hooks/useTrendingProducts";

export function TrendingProductsSection() {
  const { user } = useAuthContext();
  const { products, loading } = useTrendingProducts();

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#FAF8F5] py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-black/40 uppercase mb-2">
              Tendencias
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-black">
              Lo Más Vendido
            </h2>
            <p className="font-sans text-sm text-black/50 mt-2">
              Productos que están volando esta semana.
            </p>
          </div>
          <Link
            href="/catalogo?mas-vendidos=1"
            className="hidden md:inline-flex font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors text-black border-black/30 hover:border-black"
          >
            Ver Todo
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-black/5" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                userRole={user?.role}
                userUid={user?.uid}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/catalogo?mas-vendidos=1"
            className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase border-b pb-0.5 transition-colors text-black border-black/30 hover:border-black"
          >
            Ver Todo
          </Link>
        </div>
      </div>
    </section>
  );
}
