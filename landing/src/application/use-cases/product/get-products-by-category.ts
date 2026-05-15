import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export async function getProductsByCategory(
  repo: ProductRepository,
  categoryId: string
): Promise<Product[]> {
  return repo.findByCategory(categoryId);
}
