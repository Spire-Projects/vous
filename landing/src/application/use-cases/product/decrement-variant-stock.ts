import type { ProductRepository } from "@/domain/repositories/product.repository";

/**
 * Atomically decrements variant stock using a Firestore transaction.
 * Throws if stock is insufficient or the variant does not exist.
 */
export async function decrementVariantStock(
  repo: ProductRepository,
  productId: string,
  variantId: string,
  quantity: number
): Promise<void> {
  return repo.decrementVariantStock(productId, variantId, quantity);
}
