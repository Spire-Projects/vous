"use client";

import { useEffect, useState } from "react";
import { firestoreSiteConfigRepository } from "@/infrastructure/repositories/firestore-site-config.repository";
import type { SiteConfig } from "@/domain/entities/site-config.entity";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    firestoreSiteConfigRepository
      .get()
      .then(setConfig)
      .catch((err) => {
        console.error("[useSiteConfig] Error cargando configuración:", err);
        setError("Error al cargar la configuración del sitio");
      })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
