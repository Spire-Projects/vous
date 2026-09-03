import { useEffect, useState, useCallback } from "react";
import { firestoreLandingSectionRepository } from "@/infrastructure";
import { getLandingSections } from "@/application/use-cases/landing-section/get-landing-sections";
import { createLandingSection } from "@/application/use-cases/landing-section/create-landing-section";
import { updateLandingSection } from "@/application/use-cases/landing-section/update-landing-section";
import { deleteLandingSection } from "@/application/use-cases/landing-section/delete-landing-section";
import { setLandingSectionActive } from "@/application/use-cases/landing-section/set-landing-section-active";
import { setLandingSectionOrder } from "@/application/use-cases/landing-section/set-landing-section-order";
import { setLandingSectionProducts } from "@/application/use-cases/landing-section/set-landing-section-products";
import type {
  LandingSection,
  CreateLandingSectionInput,
  UpdateLandingSectionInput,
} from "@/domain/entities/landing-section.entity";

export function useLandingSections() {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLandingSections(firestoreLandingSectionRepository);
      setSections(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar secciones");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSections(); }, [fetchSections]);

  const create = useCallback(async (input: CreateLandingSectionInput) => {
    await createLandingSection(firestoreLandingSectionRepository, input);
    await fetchSections();
  }, [fetchSections]);

  const update = useCallback(async (id: string, input: UpdateLandingSectionInput) => {
    await updateLandingSection(firestoreLandingSectionRepository, id, input);
    await fetchSections();
  }, [fetchSections]);

  const remove = useCallback(async (id: string) => {
    await deleteLandingSection(firestoreLandingSectionRepository, id);
    await fetchSections();
  }, [fetchSections]);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await setLandingSectionActive(firestoreLandingSectionRepository, id, !current);
    await fetchSections();
  }, [fetchSections]);

  const reorder = useCallback(async (items: LandingSection[]) => {
    await Promise.all(
      items.map((s, idx) => setLandingSectionOrder(firestoreLandingSectionRepository, s.id, idx))
    );
    await fetchSections();
  }, [fetchSections]);

  const updateProducts = useCallback(async (id: string, productIds: string[]) => {
    await setLandingSectionProducts(firestoreLandingSectionRepository, id, productIds);
    await fetchSections();
  }, [fetchSections]);

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
    create,
    update,
    remove,
    toggleActive,
    reorder,
    updateProducts,
  };
}
