import { useEffect, useState, useCallback } from "react";
import { firestoreStyleGuideRepository } from "@/infrastructure";
import { getStyleGuides } from "@/application/use-cases/style-guide/get-style-guides";
import { createStyleGuide } from "@/application/use-cases/style-guide/create-style-guide";
import { updateStyleGuide } from "@/application/use-cases/style-guide/update-style-guide";
import { deleteStyleGuide } from "@/application/use-cases/style-guide/delete-style-guide";
import { setStyleGuideActive } from "@/application/use-cases/style-guide/set-style-guide-active";
import type { StyleGuide, CreateStyleGuideInput, UpdateStyleGuideInput } from "@/domain/entities/style-guide.entity";

export function useStyleGuides() {
  const [guides, setGuides] = useState<StyleGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuides = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStyleGuides(firestoreStyleGuideRepository);
      setGuides(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar guías");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchGuides(); }, [fetchGuides]);

  const create = useCallback(async (input: CreateStyleGuideInput) => {
    await createStyleGuide(firestoreStyleGuideRepository, input);
    await fetchGuides();
  }, [fetchGuides]);

  const update = useCallback(async (id: string, input: UpdateStyleGuideInput) => {
    await updateStyleGuide(firestoreStyleGuideRepository, id, input);
    await fetchGuides();
  }, [fetchGuides]);

  const remove = useCallback(async (id: string) => {
    await deleteStyleGuide(firestoreStyleGuideRepository, id);
    await fetchGuides();
  }, [fetchGuides]);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await setStyleGuideActive(firestoreStyleGuideRepository, id, !current);
    await fetchGuides();
  }, [fetchGuides]);

  return { guides, loading, error, refetch: fetchGuides, create, update, remove, toggleActive };
}
