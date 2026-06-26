"use client";

import { useEffect, useState } from "react";
import { getInfluencers } from "@/infrastructure/repositories/firestore-influencer.repository";
import type { Influencer } from "@/domain/entities/influencer.entity";

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getInfluencers();
        if (!cancelled) setInfluencers(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { influencers, loading, error };
}
