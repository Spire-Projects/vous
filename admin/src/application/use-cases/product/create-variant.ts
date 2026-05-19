import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { CreateVariantInput, ProductVariant } from "@/domain/entities/product.entity";

export async function createVariant(
  repo: ProductRepository,
  productId: string,
  input: CreateVariantInput
): Promise<ProductVariant> {
  return repo.createVariant(productId, input);
}
