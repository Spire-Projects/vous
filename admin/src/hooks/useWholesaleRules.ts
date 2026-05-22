import { useEffect, useState, useCallback } from "react";
import { firestoreWholesaleRulesRepository } from "@/infrastructure";
import { getWholesaleRules } from "@/application/use-cases/wholesale-rules/get-wholesale-rules";
import { updateWholesaleRules } from "@/application/use-cases/wholesale-rules/update-wholesale-rules";
import type { WholesaleRules, UpdateWholesaleRulesInput } from "@/domain/entities/wholesale-rules.entity";

export function useWholesaleRules() {
  const [rules, setRules] = useState<WholesaleRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWholesaleRules(firestoreWholesaleRulesRepository);
      setRules(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar reglas mayoristas");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchRules(); }, [fetchRules]);

  const update = useCallback(async (input: UpdateWholesaleRulesInput) => {
    await updateWholesaleRules(firestoreWholesaleRulesRepository, input);
    await fetchRules();
  }, [fetchRules]);

  return { rules, loading, error, refetch: fetchRules, update };
}
