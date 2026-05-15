import { useEffect, useState, useCallback } from "react";
import { firestoreCustomerRepository } from "@/infrastructure";
import { getCustomers } from "@/application/use-cases/user/get-customers";
import type { Customer } from "@/domain/entities/user.entity";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomers(firestoreCustomerRepository);
      setCustomers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleActive = useCallback(async (uid: string, current: boolean) => {
    await firestoreCustomerRepository.setActive(uid, !current);
    setCustomers((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, isActive: !current } : c))
    );
  }, []);

  return { customers, loading, error, refetch: fetchCustomers, toggleActive };
}
