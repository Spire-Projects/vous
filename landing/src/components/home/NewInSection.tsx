"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Product } from "@/domain/entities/product.entity";

const PLACEHOLDER_BG = "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]";

function formatPrice(price: number): string {
  return `Bs. ${price.toLocaleString("es-BO")}`;
}

export function NewInSection() {
  const { products, loading } = useProducts();

  const featured = products[0] ?? null;
  const sideProducts = products.slice(1, 3);

  return (
    <section className="bg-vous-warm-white py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-vous-gold uppercase mb-2">
              Últimas Piezas
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-vous-soft-black">
              Nuevas Llegadas
            </h2>
            <p className="font-sans text-sm text-vous-gray mt-2">
              Nuestra última expresión de lujo urbano.
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/catalogo?nuevas=1">Ver Todo</Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-vous-gray-light/40" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sideProducts.map((product) => (
              <ProductStandardCard key={product.id} product={product} />
            ))}

            {featured && <ProductFeaturedCard product={featured} />}
            {!featured && <ProductFeaturedCard product={null} />}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalogo?nuevas=1">Ver Todo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductStandardCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] ? proxyCldUrl(product.images[0]) : null;

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div
        className={`relative aspect-[3/4] overflow-hidden mb-4 ${!imageUrl ? `bg-gradient-to-b ${PLACEHOLDER_BG}` : ""}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0" />
        )}
        {product.badge && (
          <Badge className="absolute top-3 left-3" variant="dark">
            {product.badge}
          </Badge>
        )}
        {product.isDiscounted && product.discountPercentage && (
          <Badge className="absolute top-3 right-3 bg-red-600 text-white border-0">
            -{product.discountPercentage}%
          </Badge>
        )}
      </div>
      <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-vous-gray mb-1">
        {product.categoryName}
      </p>
      <h3 className="font-serif text-xl text-vous-soft-black group-hover:text-vous-gold transition-colors">
        {product.name}
      </h3>
      <p className="font-sans text-sm text-vous-gray mt-1">{formatPrice(product.price)}</p>
    </Link>
  );
}

function ProductFeaturedCard({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <div className="group relative aspect-[3/4] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${PLACEHOLDER_BG} group-hover:scale-105 transition-transform duration-500`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold mb-1">
            COLECCIÓN 01
          </p>
          <h3 className="font-serif text-2xl text-white mb-4">Siluetas Urbanas</h3>
          <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-vous-gold text-vous-soft-black px-5 py-2.5">
            Comprar Ahora
          </span>
        </div>
      </div>
    );
  }

  const imageUrl = product.images?.[0] ? proxyCldUrl(product.images[0]) : null;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative aspect-[3/4] overflow-hidden block"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${PLACEHOLDER_BG} group-hover:scale-105 transition-transform duration-500`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-vous-soft-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-vous-gold mb-1">
          COLECCIÓN 01
        </p>
        <h3 className="font-serif text-2xl text-white mb-4">{product.name}</h3>
        <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-vous-gold text-vous-soft-black px-5 py-2.5">
          Comprar Ahora
        </span>
      </div>
    </Link>
  );
}
