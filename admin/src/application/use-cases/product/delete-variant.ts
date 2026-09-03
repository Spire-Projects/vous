import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function deleteVariant(
  repo: ProductRepository,
  productId: string,
  variantId: string
): Promise<void> {
  return repo.deleteVariant(productId, variantId);
}
