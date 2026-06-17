import { useEffect, useState, useCallback } from "react";
import { firestoreWholesaleRulesRepository } from "@/infrastructure";
import type { WholesaleRules } from "@/domain/entities/wholesale-rules.entity";

export function useWholesaleRules() {
  const [rules, setRules] = useState<WholesaleRules | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await firestoreWholesaleRulesRepository.get();
      setRules(data);
    } catch {
      setRules(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return { rules, loading };
}
