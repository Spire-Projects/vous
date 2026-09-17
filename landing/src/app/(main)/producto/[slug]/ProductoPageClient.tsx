"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { ProductGallery } from "@/components/producto/ProductGallery";
import { ProductInfo } from "@/components/producto/ProductInfo";
import { RelatedProducts } from "@/components/producto/RelatedProducts";
import { CategoryDiscounts } from "@/components/producto/CategoryDiscounts";
import { useCategories } from "@/hooks/useCategories";
import type { Product, ProductVariant } from "@/domain/entities/product.entity";

export function ProductoPageClient() {
  const params = useParams();
  const slugRaw = params.slug;
  const slug = Array.isArray(slugRaw) ? (slugRaw[0] ?? "") : (slugRaw ?? "");

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { categories } = useCategories();
  const categorySlug = categories.find((c) => c.id === product?.categoryId)?.slug ?? undefined;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setVariants([]);
    setRelated([]);
    setSelectedColor(null);
    setSelectedSize(null);

    firestoreProductRepository
      .findBySlug(slug)
      .then(async (p) => {
        if (!p) {
          setNotFound(true);
          return;
        }
        setProduct(p);

        const relPromise = firestoreProductRepository
          .findByCategory(p.categoryId)
          .then((all) => all.filter((r) => r.id !== p.id).slice(0, 4))
          .catch(() => [] as Product[]);

        const varsPromise = firestoreProductRepository
          .findVariants(p.id)
          .catch(() => [] as ProductVariant[]);
        const [rel, vars] = await Promise.all([relPromise, varsPromise]);
        setRelated(rel);
        setVariants(vars);
        setVariantsLoading(false);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSelectColor = useCallback((color: string | null) => {
    setSelectedColor(color);
  }, []);

  const handleSelectSize = useCallback((size: string | null) => {
    setSelectedSize(size);
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <span className="inline-block w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-sans text-sm text-black/50">Producto no encontrado.</p>
        <Link
          href="/catalogo"
          className="font-nav text-[11px] uppercase tracking-wider text-black hover:underline"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-20 mb-16">
          <ProductGallery
            images={product.images}
            name={product.name}
            colors={product.colors}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            variants={variants}
          />
          <ProductInfo
            product={product}
            variants={variants}
            variantsLoading={variantsLoading}
            selectedColor={selectedColor}
            onSelectColor={handleSelectColor}
            selectedSize={selectedSize}
            onSelectSize={handleSelectSize}
          />
        </div>
        <CategoryDiscounts
          categoryId={product.categoryId}
          currentProductId={product.id}
          categorySlug={categorySlug}
        />
        <RelatedProducts products={related} categorySlug={categorySlug} />
      </div>
    </div>
  );
}
