"use client";

import { useEffect, useState } from "react";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import type { Order } from "@/domain/entities/order.entity";

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const unsubscribe = firestoreOrderRepository.subscribeToUserOrders(
      userId,
      (data) => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrders(data);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
      },
      () => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError("No pudimos cargar tus pedidos en este momento. Por favor, intentá de nuevo más tarde.");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { orders, loading, error };
}
