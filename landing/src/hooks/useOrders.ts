"use client";

import { useEffect, useState } from "react";
import { firestoreOrderRepository } from "@/infrastructure/repositories/firestore-order.repository";
import { getOrdersByUser } from "@/application/use-cases/order/get-orders-by-user";
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
      setLoading(false);
      return;
    }

    // Reset before fetching so a previous user's orders don't persist
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrders([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    getOrdersByUser(firestoreOrderRepository, userId)
      .then(setOrders)
      .catch(() => setError("Error al cargar los pedidos"))
      .finally(() => setLoading(false));
  }, [userId]);

  return { orders, loading, error };
}
