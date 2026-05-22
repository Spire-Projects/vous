import { useEffect, useState, useCallback } from "react";
import { firestoreProductRepository } from "@/infrastructure";
import { getProducts } from "@/application/use-cases/product/get-products";
import { createProduct } from "@/application/use-cases/product/create-product";
import { updateProduct } from "@/application/use-cases/product/update-product";
import { setProductActive } from "@/application/use-cases/product/set-product-active";
import { deleteProduct } from "@/application/use-cases/product/delete-product";
import { setProductFlags } from "@/application/use-cases/product/set-product-flags";
import { applyProductDiscount } from "@/application/use-cases/product/apply-product-discount";
import { applyCategoryDiscount } from "@/application/use-cases/product/apply-category-discount";
import { updateWholesaleStock } from "@/application/use-cases/product/update-wholesale-stock";
import type { Product, CreateProductInput, UpdateProductInput } from "@/domain/entities/product.entity";
import type { ProductFlags } from "@/domain/repositories/product.repository";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(firestoreProductRepository);
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const create = useCallback(async (input: CreateProductInput) => {
    await createProduct(firestoreProductRepository, input);
    await fetchProducts();
  }, [fetchProducts]);

  const update = useCallback(async (id: string, input: UpdateProductInput) => {
    await updateProduct(firestoreProductRepository, id, input);
    await fetchProducts();
  }, [fetchProducts]);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    await setProductActive(firestoreProductRepository, id, !isActive);
    await fetchProducts();
  }, [fetchProducts]);

  const remove = useCallback(async (id: string) => {
    await deleteProduct(firestoreProductRepository, id);
    await fetchProducts();
  }, [fetchProducts]);

  const setFlags = useCallback(async (id: string, flags: ProductFlags) => {
    await setProductFlags(firestoreProductRepository, id, flags);
    await fetchProducts();
  }, [fetchProducts]);

  const applyDiscount = useCallback(async (id: string, isDiscounted: boolean, discountPercentage?: number) => {
    await applyProductDiscount(firestoreProductRepository, id, isDiscounted, discountPercentage);
    await fetchProducts();
  }, [fetchProducts]);

  const applyCatDiscount = useCallback(async (categoryId: string, isDiscounted: boolean, discountPercentage?: number) => {
    await applyCategoryDiscount(firestoreProductRepository, categoryId, isDiscounted, discountPercentage);
    await fetchProducts();
  }, [fetchProducts]);

  const adjustWholesaleStock = useCallback(async (id: string, stock: number) => {
    await updateWholesaleStock(firestoreProductRepository, id, stock);
    await fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts, create, update, toggleActive, remove, setFlags, applyDiscount, applyCatDiscount, adjustWholesaleStock };
}
