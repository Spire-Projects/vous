import { useEffect, useState, useCallback } from "react";
import { firestoreProductRepository } from "@/infrastructure";
import { getProducts } from "@/application/use-cases/product/get-products";
import { setProductActive } from "@/application/use-cases/product/set-product-active";
import type { Product } from "@/domain/entities/product.entity";

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

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    await setProductActive(firestoreProductRepository, id, isActive);
    await fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts, toggleActive };
}
