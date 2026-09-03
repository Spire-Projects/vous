import { useEffect, useState, useCallback } from "react";
import { firestoreBannerRepository } from "@/infrastructure";
import { getBanners } from "@/application/use-cases/banner/get-banners";
import { createBanner } from "@/application/use-cases/banner/create-banner";
import { updateBanner } from "@/application/use-cases/banner/update-banner";
import { deleteBanner } from "@/application/use-cases/banner/delete-banner";
import { setBannerActive } from "@/application/use-cases/banner/set-banner-active";
import { setBannerOrder } from "@/application/use-cases/banner/set-banner-order";
import type { Banner, CreateBannerInput, UpdateBannerInput } from "@/domain/entities/banner.entity";

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBanners(firestoreBannerRepository);
      setBanners(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar banners");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const create = useCallback(async (input: CreateBannerInput) => {
    await createBanner(firestoreBannerRepository, input);
    await fetchBanners();
  }, [fetchBanners]);

  const update = useCallback(async (id: string, input: UpdateBannerInput) => {
    await updateBanner(firestoreBannerRepository, id, input);
    await fetchBanners();
  }, [fetchBanners]);

  const remove = useCallback(async (id: string) => {
    await deleteBanner(firestoreBannerRepository, id);
    await fetchBanners();
  }, [fetchBanners]);

  const toggleActive = useCallback(async (id: string, current: boolean) => {
    await setBannerActive(firestoreBannerRepository, id, !current);
    await fetchBanners();
  }, [fetchBanners]);

  const reorder = useCallback(async (items: Banner[]) => {
    await Promise.all(
      items.map((b, idx) => setBannerOrder(firestoreBannerRepository, b.id, idx))
    );
    await fetchBanners();
  }, [fetchBanners]);

  return { banners, loading, error, refetch: fetchBanners, create, update, remove, toggleActive, reorder };
}
