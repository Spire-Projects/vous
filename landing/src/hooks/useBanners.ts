"use client";

import { useEffect, useState } from "react";
import { firestoreBannerRepository } from "@/infrastructure/repositories/firestore-banner.repository";
import type { Banner } from "@/domain/entities/banner.entity";

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    firestoreBannerRepository
      .findActive()
      .then(setBanners)
      .catch((err) => {
        console.error("[useBanners] Error cargando banners:", err);
        setError("Error al cargar los banners");
      })
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading, error };
}
