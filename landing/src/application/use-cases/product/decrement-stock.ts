import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function decrementStock(
  repo: ProductRepository,
  productId: string,
  quantity: number
): Promise<void> {
  return repo.decrementStock(productId, quantity);
}
