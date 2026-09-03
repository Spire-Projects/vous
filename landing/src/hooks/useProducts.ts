"use client";

import { useEffect, useState } from "react";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { getVisibleProducts } from "@/application/use-cases/product/get-visible-products";
import { getVisibleProductsByCategory } from "@/application/use-cases/product/get-visible-products-by-category";
import { useAuthContext } from "@/context/AuthContext";
import type { Product } from "@/domain/entities/product.entity";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWholesaler } = useAuthContext();

  useEffect(() => {
    getVisibleProducts(firestoreProductRepository, isWholesaler)
      .then(setProducts)
      .catch((err) => {
        console.error("[useProducts] Error cargando productos:", err);
        setError("Error al cargar los productos");
      })
      .finally(() => setLoading(false));
  }, [isWholesaler]);

  return { products, loading, error };
}

export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWholesaler } = useAuthContext();

  useEffect(() => {
    if (!categoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getVisibleProductsByCategory(firestoreProductRepository, categoryId, isWholesaler)
      .then(setProducts)
      .catch((err) => {
        console.error("[useProductsByCategory] Error cargando productos:", err);
        setError("Error al cargar los productos");
      })
      .finally(() => setLoading(false));
  }, [categoryId, isWholesaler]);

  return { products, loading, error };
}
