"use client";

import { useEffect, useState } from "react";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import type { ProductVariant } from "@/domain/entities/product.entity";

export function useProductVariants(productId: string | null) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    firestoreProductRepository
      .findVariants(productId)
      .then(setVariants)
      .catch(() => setVariants([]))
      .finally(() => setLoading(false));
  }, [productId]);

  return { variants, loading };
}
