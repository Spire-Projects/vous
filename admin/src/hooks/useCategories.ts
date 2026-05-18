import { useEffect, useState } from "react";
import { firestoreCategoryRepository } from "@/infrastructure/repositories/firestore-category.repository";
import type { Category } from "@/domain/entities/category.entity";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestoreCategoryRepository
      .findAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
