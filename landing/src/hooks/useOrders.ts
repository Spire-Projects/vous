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
      setOrders([]);
      setLoading(false);
      return;
    }

    getOrdersByUser(firestoreOrderRepository, userId)
      .then(setOrders)
      .catch(() => setError("Error al cargar los pedidos"))
      .finally(() => setLoading(false));
  }, [userId]);

  return { orders, loading, error };
}
