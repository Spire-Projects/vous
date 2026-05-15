import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order } from "@/domain/entities/order.entity";

export async function getOrders(repo: OrderRepository, limit?: number): Promise<Order[]> {
  return repo.findAll(limit);
}
