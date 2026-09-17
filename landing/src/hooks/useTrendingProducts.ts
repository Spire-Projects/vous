"use client";

import { useEffect, useState } from "react";
import { getDocs, collection, query, where, orderBy, limit } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Product } from "@/domain/entities/product.entity";

export function useTrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const db = getFirebaseDb();
        const q = query(
          collection(db, "products"),
          where("weeklySales", ">", 0),
          orderBy("weeklySales", "desc"),
          limit(12)
        );
        const snap = await getDocs(q);
        const data = snap.docs
          .map((d) => {
            const raw = d.data();
            return {
              id: d.id,
              slug: (raw.slug as string) ?? "",
              name: (raw.name as string) ?? "",
              description: (raw.description as string) ?? "",
              detail: (raw.detail as string) ?? "",
              price: (raw.price as number) ?? 0,
              wholesalePrice: (raw.wholesalePrice as number) ?? undefined,
              categoryId: (raw.categoryId as string) ?? "",
              categoryName: (raw.categoryName as string) ?? "",
              badge: (raw.badge as string) ?? undefined,
              images: (raw.images as string[]) ?? [],
              sizes: (raw.sizes as string[]) ?? [],
              colors: (raw.colors as { hex: string; name: string; images?: string[] }[]) ?? [],
              materials: (raw.materials as string[]) ?? [],
              hasVariants: (raw.hasVariants as boolean) ?? false,
              isActive: (raw.isActive as boolean) ?? true,
              isFeatured: (raw.isFeatured as boolean) ?? false,
              isPreorder: (raw.isPreorder as boolean) ?? false,
              isSpecialCollection: (raw.isSpecialCollection as boolean) ?? false,
              isBestseller: (raw.isBestseller as boolean) ?? false,
              isDiscounted: (raw.isDiscounted as boolean) ?? false,
              discountPercentage: (raw.discountPercentage as number) ?? undefined,
              wholesaleOnly: (raw.wholesaleOnly as boolean) ?? undefined,
              wholesaleStock: (raw.wholesaleStock as number) ?? undefined,
              stock: (raw.stock as number) ?? 0,
              sortOrder: (raw.sortOrder as number) ?? 0,
              attributes: (raw.attributes as Record<string, string>) ?? {},
              tags: (raw.tags as string[]) ?? undefined,
              totalSales: (raw.totalSales as number) ?? 0,
              weeklySales: (raw.weeklySales as number) ?? 0,
              createdAt:
                (raw.createdAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
                new Date().toISOString(),
              updatedAt:
                (raw.updatedAt as { toDate?: () => Date })?.toDate?.().toISOString() ??
                new Date().toISOString(),
            } as Product;
          })
          .filter((p) => p.isActive && (p.stock > 0 || p.hasVariants))
          .slice(0, 8);
        if (!cancelled) setProducts(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}
