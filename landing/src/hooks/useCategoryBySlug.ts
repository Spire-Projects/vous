"use client";

import { useEffect, useState } from "react";
import { firestoreCategoryRepository } from "@/infrastructure/repositories/firestore-category.repository";
import type { Category } from "@/domain/entities/category.entity";

export function useCategoryBySlug(slug: string) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Categoría no encontrada");
      return;
    }
    setLoading(true);
    firestoreCategoryRepository
      .findBySlug(slug)
      .then((cat) => {
        if (!cat) {
          setError("Categoría no encontrada");
        } else {
          setCategory(cat);
          setError(null);
        }
      })
      .catch(() => setError("Error al cargar la categoría"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { category, loading, error };
}
