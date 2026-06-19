import { useEffect, useState, useCallback } from "react";
import { firestoreProductRepository } from "@/infrastructure";
import { createVariant } from "@/application/use-cases/product/create-variant";
import { updateVariant } from "@/application/use-cases/product/update-variant";
import { deleteVariant } from "@/application/use-cases/product/delete-variant";
import { recalculateProductStock } from "@/application/use-cases/product/recalculate-product-stock";
import type {
  ProductVariant,
  CreateVariantInput,
  UpdateVariantInput,
} from "@/domain/entities/product.entity";

export function useVariants(productId: string | null) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariants = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await firestoreProductRepository.findVariants(productId);
      setVariants(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar variantes");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchVariants(); }, [fetchVariants]);

  const create = useCallback(
    async (input: CreateVariantInput) => {
      if (!productId) return;
      await createVariant(firestoreProductRepository, productId, input);
      await recalculateProductStock(firestoreProductRepository, productId);
      await fetchVariants();
    },
    [productId, fetchVariants]
  );

  const update = useCallback(
    async (variantId: string, input: UpdateVariantInput) => {
      if (!productId) return;
      await updateVariant(firestoreProductRepository, productId, variantId, input);
      await recalculateProductStock(firestoreProductRepository, productId);
      await fetchVariants();
    },
    [productId, fetchVariants]
  );

  const remove = useCallback(
    async (variantId: string) => {
      if (!productId) return;
      await deleteVariant(firestoreProductRepository, productId, variantId);
      await recalculateProductStock(firestoreProductRepository, productId);
      await fetchVariants();
    },
    [productId, fetchVariants]
  );

  return { variants, loading, error, create, update, remove, refetch: fetchVariants };
}
