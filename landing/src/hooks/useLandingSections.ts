"use client";

import { useEffect, useState } from "react";
import { firestoreLandingSectionRepository } from "@/infrastructure";
import { getActiveLandingSections } from "@/application/use-cases/landing-section/get-active-landing-sections";
import type { LandingSectionWithProducts } from "@/domain/repositories/landing-section.repository";

export function useLandingSections() {
  const [sections, setSections] = useState<LandingSectionWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveLandingSections(firestoreLandingSectionRepository)
      .then(setSections)
      .catch((err) => {
        console.error("[useLandingSections] Error:", err);
        setSections([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading };
}
