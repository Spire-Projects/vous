"use client";

import { useEffect, useState } from "react";
import { firestoreProductRepository } from "@/infrastructure/repositories/firestore-product.repository";
import { getProducts } from "@/application/use-cases/product/get-products";
import { getProductsByCategory } from "@/application/use-cases/product/get-products-by-category";
import type { Product } from "@/domain/entities/product.entity";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts(firestoreProductRepository)
      .then(setProducts)
      .catch(() => setError("Error al cargar los productos"))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}

export function useProductsByCategory(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getProductsByCategory(firestoreProductRepository, categoryId)
      .then(setProducts)
      .catch(() => setError("Error al cargar los productos"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { products, loading, error };
}
