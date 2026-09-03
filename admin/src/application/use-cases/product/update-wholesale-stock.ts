import type { ProductRepository } from "@/domain/repositories/product.repository";

/**
 * Manually adjusts the wholesale stock for a product.
 */
export async function updateWholesaleStock(
  repo: ProductRepository,
  productId: string,
  stock: number
): Promise<void> {
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("El stock mayorista debe ser un número positivo");
  }
  await repo.updateWholesaleStock(productId, Math.floor(stock));
}
