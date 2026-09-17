import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function recalculateProductStock(
  repo: ProductRepository,
  productId: string
): Promise<void> {
  const variants = await repo.findVariants(productId);
  const totalStock = variants
    .filter((v) => v.isActive)
    .reduce((sum, v) => sum + (v.stock || 0), 0);
  await repo.update(productId, { stock: totalStock });
}
