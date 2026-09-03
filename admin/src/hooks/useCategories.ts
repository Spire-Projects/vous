import { useEffect, useState } from "react";
import { firestoreCategoryRepository } from "@/infrastructure/repositories/firestore-category.repository";
import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    firestoreCategoryRepository
      .findAll()
      .then(setCategories)
      .catch((err) => {
        console.error("[useCategories] Error cargando categorías:", err);
        setError("Error al cargar las categorías");
      })
      .finally(() => setLoading(false));
  }, []);

  async function create(data: CreateCategoryInput) {
    const cat = await firestoreCategoryRepository.save(data);
    setCategories((prev) => [...prev, cat].sort((a, b) => a.sortOrder - b.sortOrder));
  }

  async function update(id: string, data: Partial<CreateCategoryInput>) {
    const defined = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    await firestoreCategoryRepository.update(id, defined);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...defined } : c)));
  }

  async function remove(id: string) {
    await firestoreCategoryRepository.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function reorder(items: { id: string; sortOrder: number }[]) {
    const map = new Map(items.map((i) => [i.id, i.sortOrder]));
    setCategories((prev) =>
      [...prev.map((c) => ({ ...c, sortOrder: map.get(c.id) ?? c.sortOrder }))]
        .sort((a, b) => a.sortOrder - b.sortOrder)
    );
    await firestoreCategoryRepository.updateOrder(items);
  }

  return { categories, loading, error, create, update, remove, reorder };
}
