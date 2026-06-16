"use client";

import { useEffect, useState } from "react";
import { firestoreStyleGuideRepository } from "@/infrastructure/repositories/firestore-style-guide.repository";
import type { StyleGuide } from "@/domain/entities/style-guide.entity";

export function useStyleGuides() {
  const [guides, setGuides] = useState<StyleGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await firestoreStyleGuideRepository.findAll();
        if (!cancelled) setGuides(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { guides, loading, error };
}
