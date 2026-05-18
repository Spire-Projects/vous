import { useEffect, useState, useCallback } from "react";
import { firestoreFAQRepository } from "@/infrastructure";
import { getFAQs } from "@/application/use-cases/faq/get-faqs";
import { createFAQ } from "@/application/use-cases/faq/create-faq";
import { updateFAQ } from "@/application/use-cases/faq/update-faq";
import { deleteFAQ } from "@/application/use-cases/faq/delete-faq";
import { setFAQActive } from "@/application/use-cases/faq/toggle-faq-active";
import type { FAQ, CreateFAQInput, UpdateFAQInput } from "@/domain/entities/faq.entity";

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFAQs(firestoreFAQRepository);
      setFaqs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchFAQs(); }, [fetchFAQs]);

  const create = useCallback(async (input: CreateFAQInput) => {
    await createFAQ(firestoreFAQRepository, input);
    await fetchFAQs();
  }, [fetchFAQs]);

  const update = useCallback(async (id: string, input: UpdateFAQInput) => {
    await updateFAQ(firestoreFAQRepository, id, input);
    await fetchFAQs();
  }, [fetchFAQs]);

  const remove = useCallback(async (id: string) => {
    await deleteFAQ(firestoreFAQRepository, id);
    await fetchFAQs();
  }, [fetchFAQs]);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await setFAQActive(firestoreFAQRepository, id, !current);
    await fetchFAQs();
  }, [fetchFAQs]);

  return { faqs, loading, error, refetch: fetchFAQs, create, update, remove, toggleActive };
}
