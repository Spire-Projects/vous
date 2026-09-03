import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { UpdateVariantInput } from "@/domain/entities/product.entity";

export async function updateVariant(
  repo: ProductRepository,
  productId: string,
  variantId: string,
  input: UpdateVariantInput
): Promise<void> {
  return repo.updateVariant(productId, variantId, input);
}
