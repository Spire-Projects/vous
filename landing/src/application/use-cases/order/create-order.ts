import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { Order, CreateOrderInput } from "@/domain/entities/order.entity";

export async function createOrder(repo: OrderRepository, input: CreateOrderInput): Promise<Order> {
  return repo.create(input);
}
