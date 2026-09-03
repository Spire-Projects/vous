import { useEffect, useState, useCallback } from "react";
import { firestoreWholesaleRepository } from "@/infrastructure";
import { getWholesaleRequests, reviewWholesaleRequest } from "@/application/use-cases/wholesale/manage-wholesale";
import type { WholesaleRequest, ReviewWholesaleInput } from "@/domain/entities/wholesale.entity";

export function useWholesale() {
  const [requests, setRequests] = useState<WholesaleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWholesaleRequests(firestoreWholesaleRepository);
      setRequests(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const review = useCallback(async (input: ReviewWholesaleInput) => {
    await reviewWholesaleRequest(firestoreWholesaleRepository, input);
    await fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests, review };
}
