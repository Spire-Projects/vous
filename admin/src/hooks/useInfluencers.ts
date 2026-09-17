import { useEffect, useState, useCallback } from "react";
import { firestoreInfluencerRepository } from "@/infrastructure";
import { getAllInfluencers } from "@/application/use-cases/influencer/get-all-influencers";
import { createInfluencer } from "@/application/use-cases/influencer/create-influencer";
import { updateInfluencer } from "@/application/use-cases/influencer/update-influencer";
import { deleteInfluencer } from "@/application/use-cases/influencer/delete-influencer";
import type { Influencer, CreateInfluencerInput, UpdateInfluencerInput } from "@/domain/entities/influencer.entity";

export function useInfluencers() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllInfluencers(firestoreInfluencerRepository);
      setInfluencers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar influencers");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = useCallback(async (input: CreateInfluencerInput) => {
    setSaving(true);
    try {
      await createInfluencer(firestoreInfluencerRepository, input);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear influencer");
    } finally {
      setSaving(false);
    }
  }, [fetchAll]);

  const update = useCallback(async (id: string, input: UpdateInfluencerInput) => {
    setSaving(true);
    try {
      await updateInfluencer(firestoreInfluencerRepository, id, input);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar influencer");
    } finally {
      setSaving(false);
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setSaving(true);
    try {
      await deleteInfluencer(firestoreInfluencerRepository, id);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar influencer");
    } finally {
      setSaving(false);
    }
  }, [fetchAll]);

  return { influencers, loading, error, saving, refetch: fetchAll, create, update, remove };
}
