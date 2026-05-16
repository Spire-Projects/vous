import { useEffect, useState, useCallback } from "react";
import { firestoreOrderRepository } from "@/infrastructure";
import { getOrders } from "@/application/use-cases/order/get-orders";
import { updateOrderStatus } from "@/application/use-cases/order/update-order-status";
import type { Order, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

export function useOrders(limitCount?: number) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders(firestoreOrderRepository, limitCount);
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, [limitCount]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const changeStatus = useCallback(async (input: UpdateOrderStatusInput) => {
    await updateOrderStatus(firestoreOrderRepository, input);
    await fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders, changeStatus };
}
