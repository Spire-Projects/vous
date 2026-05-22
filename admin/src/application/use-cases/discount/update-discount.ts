import type { DiscountRepository } from "@/domain/repositories/discount.repository";
import type { UpdateDiscountInput } from "@/domain/entities/discount.entity";

export async function updateDiscount(
  repo: DiscountRepository,
  id: string,
  input: UpdateDiscountInput
): Promise<void> {
  return repo.update(id, input);
}
