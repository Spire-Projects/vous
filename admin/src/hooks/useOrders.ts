import { useEffect, useState, useCallback } from "react";
import { firestoreOrderRepository } from "@/infrastructure";
import { updateOrderStatus } from "@/application/use-cases/order/update-order-status";
import { cancelOrderRestoreStock } from "@/application/use-cases/order/cancel-order-restore-stock";
import { updateAdminNotes } from "@/application/use-cases/order/update-admin-notes";
import type { Order, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

/**
 * Real-time orders hook backed by Firestore onSnapshot.
 * The subscription stays active for the component's lifetime and
 * automatically delivers updates without manual refetching.
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    const unsubscribe = firestoreOrderRepository.subscribeAll(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const changeStatus = useCallback(async (input: UpdateOrderStatusInput) => {
    await updateOrderStatus(firestoreOrderRepository, input);
    // onSnapshot delivers the updated doc automatically
  }, []);

  const cancelWithStockRestore = useCallback(
    async (orderId: string, note: string) => {
      await cancelOrderRestoreStock(firestoreOrderRepository, orderId, note);
    },
    []
  );

  const updateNotes = useCallback(async (orderId: string, notes: string) => {
    await updateAdminNotes(firestoreOrderRepository, orderId, notes);
  }, []);

  return { orders, loading, error, changeStatus, cancelWithStockRestore, updateNotes };
}
