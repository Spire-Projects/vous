import type { OrderRepository } from "@/domain/repositories/order.repository";

export async function uploadPaymentProof(
  repo: OrderRepository,
  orderId: string,
  proofUrl: string
): Promise<void> {
  return repo.updatePaymentProof(orderId, proofUrl);
}
