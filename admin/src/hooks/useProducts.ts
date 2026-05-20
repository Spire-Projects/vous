import { useEffect, useState, useCallback } from "react";
import { firestoreProductRepository } from "@/infrastructure";
import { getProducts } from "@/application/use-cases/product/get-products";
import { createProduct } from "@/application/use-cases/product/create-product";
import { updateProduct } from "@/application/use-cases/product/update-product";
import { setProductActive } from "@/application/use-cases/product/set-product-active";
import { deleteProduct } from "@/application/use-cases/product/delete-product";
import type { Product, CreateProductInput, UpdateProductInput } from "@/domain/entities/product.entity";

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

  return { products, loading, error, refetch: fetchProducts, create, update, toggleActive, remove };
}
