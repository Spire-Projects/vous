import { useEffect, useState, useCallback } from "react";
import { firestoreSiteConfigRepository } from "@/infrastructure";
import { getSiteConfig } from "@/application/use-cases/site-config/get-site-config";
import { updateSiteConfig } from "@/application/use-cases/site-config/update-site-config";
import type { SiteConfig, UpdateSiteConfigInput } from "@/domain/entities/site-config.entity";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteConfig(firestoreSiteConfigRepository);
      setConfig(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const update = useCallback(async (input: UpdateSiteConfigInput) => {
    setSaving(true);
    try {
      await updateSiteConfig(firestoreSiteConfigRepository, input);
      await fetchConfig();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  }, [fetchConfig]);

  return { config, loading, error, saving, refetch: fetchConfig, update };
}
