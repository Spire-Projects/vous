"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { ProductGallery } from "@/components/producto/ProductGallery";
import { ProductInfo } from "@/components/producto/ProductInfo";
import { RelatedProducts } from "@/components/producto/RelatedProducts";
import type { Product } from "@/domain/entities/product.entity";

export function ProductoPageClient() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    firestoreProductRepository
      .findBySlug(slug)
      .then(async (p) => {
        if (!p) {
          setNotFound(true);
          return;
        }
        setProduct(p);
        const rel = await firestoreProductRepository
          .findByCategory(p.categoryId)
          .then((all) => all.filter((r) => r.id !== p.id).slice(0, 4))
          .catch(() => []);
        setRelated(rel);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-vous-warm-white min-h-screen flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-vous-gold/30 border-t-vous-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-vous-warm-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-sans text-sm text-vous-gray">Producto no encontrado.</p>
        <Link
          href="/catalogo"
          className="font-nav text-[11px] uppercase tracking-wider text-vous-gold hover:underline"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-vous-warm-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 mb-16">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
