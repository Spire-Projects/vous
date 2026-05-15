import type { Order, UpdateOrderStatusInput } from "@/domain/entities/order.entity";

export interface OrderRepository {
  findAll(limit?: number): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByStatus(status: Order["status"]): Promise<Order[]>;
  updateStatus(input: UpdateOrderStatusInput): Promise<void>;
}
