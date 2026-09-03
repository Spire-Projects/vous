import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export async function getProductBySlug(
  repo: ProductRepository,
  slug: string
): Promise<Product | null> {
  return repo.findBySlug(slug);
}
