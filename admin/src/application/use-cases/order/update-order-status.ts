import type { OrderRepository } from "@/domain/repositories/order.repository";
import type { UpdateOrderStatusInput } from "@/domain/entities/order.entity";

export async function updateOrderStatus(
  repo: OrderRepository,
  input: UpdateOrderStatusInput
): Promise<void> {
  return repo.updateStatus(input);
}
