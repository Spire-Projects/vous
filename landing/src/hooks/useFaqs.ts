"use client";

import { useEffect, useState } from "react";
import { firestoreFAQRepository } from "@/infrastructure/repositories/firestore-faq.repository";
import type { FAQ } from "@/domain/entities/faq.entity";

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    firestoreFAQRepository
      .findActive()
      .then(setFaqs)
      .catch((err) => {
        console.error("[useFAQs] Error cargando FAQs:", err);
        setError("Error al cargar las preguntas frecuentes");
      })
      .finally(() => setLoading(false));
  }, []);

  return { faqs, loading, error };
}
