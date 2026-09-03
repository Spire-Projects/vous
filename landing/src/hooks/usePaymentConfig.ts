"use client";

import { useEffect, useState } from "react";
import { firestorePaymentConfigRepository } from "@/infrastructure/repositories/firestore-payment-config.repository";
import type { PaymentConfig } from "@/domain/entities/payment-config.entity";

export function usePaymentConfig() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestorePaymentConfigRepository
      .get()
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
