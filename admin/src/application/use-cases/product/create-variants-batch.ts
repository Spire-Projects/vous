import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { CreateVariantInput } from "@/domain/entities/product.entity";

export async function createVariantsBatch(
  repo: ProductRepository,
  productId: string,
  inputs: CreateVariantInput[]
): Promise<void> {
  if (inputs.length === 0) return;
  await repo.createVariantsBatch(productId, inputs);
}
