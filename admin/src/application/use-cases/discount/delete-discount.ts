import type { DiscountRepository } from "@/domain/repositories/discount.repository";

export async function deleteDiscount(repo: DiscountRepository, id: string): Promise<void> {
  return repo.delete(id);
}
