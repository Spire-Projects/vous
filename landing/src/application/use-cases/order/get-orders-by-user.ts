import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order } from "@/domain/entities/order.entity";

export async function getOrdersByUser(repo: OrderRepository, userId: string): Promise<Order[]> {
  return repo.findByUser(userId);
}
