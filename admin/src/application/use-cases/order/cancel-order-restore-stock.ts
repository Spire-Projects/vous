import type { OrderRepository } from "@/domain/repositories/order.repository";

export async function cancelOrderRestoreStock(
  repo: OrderRepository,
  orderId: string,
  adminNotes?: string
): Promise<void> {
  return repo.cancelAndRestoreStock(orderId, adminNotes);
}
