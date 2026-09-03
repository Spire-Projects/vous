import type { DiscountRepository } from "@/domain/repositories/discount.repository";

export async function toggleDiscountActive(
  repo: DiscountRepository,
  id: string,
  isActive: boolean
): Promise<void> {
  return repo.toggleActive(id, isActive);
}
