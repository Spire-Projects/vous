import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type { Discount } from "@/domain/entities/discount.entity";

export async function getDiscounts(repo: DiscountRepository): Promise<Discount[]> {
  return repo.findAll();
}
