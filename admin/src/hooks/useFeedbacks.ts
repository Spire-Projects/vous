import { useEffect, useState, useCallback } from "react";
import { firestoreFeedbackRepository } from "@/infrastructure";
import { getFeedbacks } from "@/application/use-cases/feedback/get-feedbacks";
import { createFeedback } from "@/application/use-cases/feedback/create-feedback";
import { updateFeedback } from "@/application/use-cases/feedback/update-feedback";
import { deleteFeedback } from "@/application/use-cases/feedback/delete-feedback";
import { setFeedbackStatus } from "@/application/use-cases/feedback/set-feedback-status";
import type { Feedback, CreateFeedbackInput, UpdateFeedbackInput, FeedbackStatus } from "@/domain/entities/feedback.entity";

export function useFeedbacks() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFeedbacks(firestoreFeedbackRepository);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const create = useCallback(async (input: CreateFeedbackInput) => {
    await createFeedback(firestoreFeedbackRepository, input);
    await fetchItems();
  }, [fetchItems]);

  const update = useCallback(async (id: string, input: UpdateFeedbackInput) => {
    await updateFeedback(firestoreFeedbackRepository, id, input);
    await fetchItems();
  }, [fetchItems]);

  const remove = useCallback(async (id: string) => {
    await deleteFeedback(firestoreFeedbackRepository, id);
    await fetchItems();
  }, [fetchItems]);

  const setStatus = useCallback(async (id: string, status: FeedbackStatus) => {
    await setFeedbackStatus(firestoreFeedbackRepository, id, status);
    await fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems, create, update, remove, setStatus };
}
