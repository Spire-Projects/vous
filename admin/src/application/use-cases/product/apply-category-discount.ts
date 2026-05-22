import type { ProductRepository } from "@/domain/repositories/product.repository";

const MAX_DISCOUNT = 90;

export async function applyCategoryDiscount(
  repo: ProductRepository,
  categoryId: string,
  isDiscounted: boolean,
  discountPercentage?: number
): Promise<void> {
  const cappedPct = discountPercentage != null
    ? Math.max(0, Math.min(discountPercentage, MAX_DISCOUNT))
    : undefined;
  return repo.applyCategoryDiscount(categoryId, isDiscounted, cappedPct);
}
