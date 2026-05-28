"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { proxyCldUrl } from "@/utils/proxyCldUrl";
import type { Product } from "@/domain/entities/product.entity";

const PLACEHOLDER_BG = "from-[#1a1a18] via-[#2a2015] to-[#0d0d0b]";

function formatPrice(price: number): string {
  return `Bs. ${price.toLocaleString("es-BO")}`;
}

export function ShopTheLookSection() {
  const { products, loading } = useProducts();

  const lookProducts = products.slice(3, 7);

  return (
    <section className="max-w-[1440px] mx-auto px-5 md:px-20 pb-20 md:pb-28">
      <h3 className="font-serif text-2xl italic text-vous-gold mb-12 uppercase">
        Completa el Look
      </h3>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse bg-vous-gray-light/40" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {lookProducts.map((product) => (
            <ProductLookCard key={product.id} product={product} />
          ))}
          {lookProducts.length === 0 && (
            <p className="col-span-full text-center font-sans text-sm text-vous-gray py-12">
              Próximamente nuevos productos para completar tu look.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function ProductLookCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] ? proxyCldUrl(product.images[0]) : null;

  return (
    <Link href={`/producto/${product.slug}`} className="group cursor-pointer">
      <div
        className={`relative aspect-[3/4] overflow-hidden mb-5 ${!imageUrl ? `bg-gradient-to-b ${PLACEHOLDER_BG}` : "bg-vous-gray-dark"}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0" />
        )}
        {product.badge && (
          <Badge className="absolute top-4 left-4" variant="dark">
            {product.badge}
          </Badge>
        )}
        {product.isDiscounted && product.discountPercentage && (
          <Badge className="absolute top-4 right-4 bg-red-600 text-white border-0">
            -{product.discountPercentage}%
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-vous-soft-black px-6 py-2 font-nav text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-vous-gold transition-colors">
            VER
          </span>
        </div>
      </div>
      <h4 className="font-sans text-sm mb-1 uppercase tracking-tight text-vous-soft-black">
        {product.name}
      </h4>
      <span className="font-sans text-sm font-bold text-vous-soft-black">
        {formatPrice(product.price)}
      </span>
    </Link>
  );
}
