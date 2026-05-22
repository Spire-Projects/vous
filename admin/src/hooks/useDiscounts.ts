import { useEffect, useState, useCallback } from "react";
import { firestoreDiscountRepository } from "@/infrastructure";
import { getDiscounts } from "@/application/use-cases/discount/get-discounts";
import { createDiscount } from "@/application/use-cases/discount/create-discount";
import { updateDiscount } from "@/application/use-cases/discount/update-discount";
import { deleteDiscount } from "@/application/use-cases/discount/delete-discount";
import { toggleDiscountActive } from "@/application/use-cases/discount/toggle-discount-active";
import type { Discount, CreateDiscountInput, UpdateDiscountInput } from "@/domain/entities/discount.entity";

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDiscounts(firestoreDiscountRepository);
      setDiscounts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar descuentos");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const create = useCallback(async (input: CreateDiscountInput) => {
    await createDiscount(firestoreDiscountRepository, input);
    await fetchDiscounts();
  }, [fetchDiscounts]);

  const update = useCallback(async (id: string, input: UpdateDiscountInput) => {
    await updateDiscount(firestoreDiscountRepository, id, input);
    await fetchDiscounts();
  }, [fetchDiscounts]);

  const remove = useCallback(async (id: string) => {
    await deleteDiscount(firestoreDiscountRepository, id);
    await fetchDiscounts();
  }, [fetchDiscounts]);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    await toggleDiscountActive(firestoreDiscountRepository, id, !isActive);
    await fetchDiscounts();
  }, [fetchDiscounts]);

  return { discounts, loading, error, refetch: fetchDiscounts, create, update, remove, toggleActive };
}
