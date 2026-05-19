"use client";

import { useEffect, useState } from "react";
import { firestoreCategoryRepository } from "@/infrastructure/repositories/firestore-category.repository";
import { getCategories } from "@/application/use-cases/category/get-categories";
import type { Category } from "@/domain/entities/category.entity";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories(firestoreCategoryRepository)
      .then(setCategories)
      .catch((err) => {
        console.error("[useCategories] Error cargando categorías:", err);
        setError("Error al cargar las categorías");
      })
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}
