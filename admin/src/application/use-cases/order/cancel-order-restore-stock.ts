import type { OrderRepository } from "@/domain/repositories/order.repository";

export async function cancelOrderRestoreStock(
  repo: OrderRepository,
  orderId: string,
  note: string
): Promise<void> {
  return repo.cancelAndRestoreStock(orderId, note);
}
