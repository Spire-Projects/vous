import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type { Discount, CreateDiscountInput } from "@/domain/entities/discount.entity";

export async function createDiscount(
  repo: DiscountRepository,
  input: CreateDiscountInput
): Promise<Discount> {
  return repo.create(input);
}
