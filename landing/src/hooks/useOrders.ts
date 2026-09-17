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

      setError(null);

      setLoading(false);
      return;
    }

    setOrders([]);

    setError(null);

    setLoading(true);

    firestoreOrderRepository
      .findByUser(userId)
      .then((data) => {
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "No pudimos cargar tus pedidos en este momento. Por favor, intentá de nuevo más tarde."
        );
        setLoading(false);
      });
  }, [userId]);

  return { orders, loading, error };
}
