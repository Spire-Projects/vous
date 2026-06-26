"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
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
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="font-nav text-[11px] font-semibold tracking-[0.25em] text-black/40 uppercase mb-2">
              Últimas Piezas
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-black">
              Nuevas Llegadas
            </h2>
            <p className="font-sans text-sm text-black/50 mt-2">
              Nuestra última expresión de lujo urbano.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden md:inline-flex text-black/60 hover:text-black"
          >
            <Link href="/catalogo?nuevas=1">Ver Todo</Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-black/5" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {sideProducts.map((product) => (
              <ProductStandardCard key={product.id} product={product} />
            ))}

            {featured && <ProductFeaturedCard product={featured} />}
            {!featured && <ProductFeaturedCard product={null} />}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
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
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div
        className={`relative aspect-[3/4] overflow-hidden mb-3 bg-black/5 ${!imageUrl ? `bg-gradient-to-b ${PLACEHOLDER_BG}` : ""}`}
      >
        {hasMultipleImages ? (
          <ImageCarousel
            images={product.images}
            alt={product.name}
            aspect="auto"
            interval={1500}
            showDots={false}
            pauseOnHover
            className="w-full h-full"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
          <Badge className="absolute top-3 right-3 bg-black text-white border-0">
            -{product.discountPercentage}%
          </Badge>
        )}
      </div>
      <p className="font-nav text-[11px] tracking-[0.15em] uppercase text-black/40 mb-1">
        {product.categoryName}
      </p>
      <h3 className="font-serif text-base text-black group-hover:text-black/70 transition-colors duration-300">
        {product.name}
      </h3>
      <p className="font-sans text-sm text-black font-medium mt-1">{formatPrice(product.price)}</p>
    </Link>
  );
}

function ProductFeaturedCard({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <div className="group relative aspect-[3/4] overflow-hidden bg-neutral-900">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${PLACEHOLDER_BG} group-hover:scale-105 transition-transform duration-700`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1">
            COLECCIÓN 01
          </p>
          <h3 className="font-serif text-xl md:text-2xl text-white mb-4">Siluetas Urbanas</h3>
          <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-white text-black px-5 py-2.5 hover:bg-white/80 transition-colors duration-300">
            Comprar Ahora
          </span>
        </div>
      </div>
    );
  }

  const imageUrl = product.images?.[0] ? proxyCldUrl(product.images[0]) : null;
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative aspect-[3/4] overflow-hidden block bg-neutral-900"
    >
      {hasMultipleImages ? (
        <ImageCarousel
          images={product.images}
          alt={product.name}
          aspect="auto"
          interval={1500}
          showDots={false}
          pauseOnHover
          className="w-full h-full"
        />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-b ${PLACEHOLDER_BG} group-hover:scale-105 transition-transform duration-700`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <p className="font-nav text-[11px] tracking-[0.2em] uppercase text-white/40 mb-1">
          COLECCIÓN 01
        </p>
        <h3 className="font-serif text-xl md:text-2xl text-white mb-4">{product.name}</h3>
        <span className="inline-flex items-center font-nav text-[11px] font-semibold tracking-[0.15em] uppercase bg-white text-black px-5 py-2.5 hover:bg-white/80 transition-colors duration-300">
          Comprar Ahora
        </span>
      </div>
    </Link>
  );
}
