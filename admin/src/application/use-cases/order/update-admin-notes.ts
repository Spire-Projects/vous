import type { OrderRepository } from "@/domain/repositories/order.repository";

export async function updateAdminNotes(
  repo: OrderRepository,
  orderId: string,
  notes: string
): Promise<void> {
  return repo.updateNotes(orderId, notes);
}
