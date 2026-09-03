import { useEffect, useState, useCallback } from "react";
import { firestorePaymentConfigRepository } from "@/infrastructure";
import { getPaymentConfig } from "@/application/use-cases/payment-config/get-payment-config";
import { updatePaymentConfig } from "@/application/use-cases/payment-config/update-payment-config";
import type { PaymentConfig, UpdatePaymentConfigInput } from "@/domain/entities/payment-config.entity";

export function usePaymentConfig() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentConfig(firestorePaymentConfigRepository);
      setConfig(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar configuración de pagos");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const update = useCallback(
    async (input: UpdatePaymentConfigInput) => {
      setSaving(true);
      try {
        await updatePaymentConfig(firestorePaymentConfigRepository, input);
        await fetchConfig();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al guardar configuración de pagos");
      } finally {
        setSaving(false);
      }
    },
    [fetchConfig]
  );

  return { config, loading, saving, error, update };
}
