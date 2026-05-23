"use client";

import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

export function SaleProductsSection() {
  const { products, loading } = useProducts();
  const { user } = useAuthContext();

  const discounted = products.filter((p) => p.isDiscounted).slice(0, 8);

  if (!loading && discounted.length === 0) return null;

  return (
    <section className="bg-vous-cream py-20 md:py-28" id="ofertas">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
              Ofertas
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black">
              Productos en Oferta
            </h2>
            <p className="font-sans text-sm text-vous-gray mt-2">
              Exclusividad a un precio excepcional por tiempo limitado.
            </p>
          </div>
          <Link
            href="/catalogo?descuento=1"
            className="hidden md:inline-flex font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-vous-soft-black border-b border-vous-soft-black/30 pb-0.5 hover:border-vous-soft-black transition-colors"
          >
            Ver Todo Sale
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-vous-gray-light/40" />
            ))}
          </div>
        )}

        {!loading && discounted.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {discounted.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                userRole={user?.role}
                userUid={user?.uid}
              />
            ))}
          </div>
        )}

        {!loading && discounted.length === 0 && (
          <p className="font-sans text-sm text-vous-gray">
            No hay productos en oferta en este momento.
          </p>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/catalogo?descuento=1"
            className="font-nav text-[11px] font-semibold tracking-[0.15em] uppercase text-vous-soft-black border-b border-vous-soft-black/30 pb-0.5"
          >
            Ver Todo Sale
          </Link>
        </div>
      </div>
    </section>
  );
}
