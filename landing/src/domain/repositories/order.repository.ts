import type { Order } from "@/domain/entities/order.entity";

export interface OrderRepository {
  findByUser(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order>;
}
