import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";
import { filterProductsByRole } from "./filter-products-by-role";

/**
 * Returns products for a given category filtered by the user's role.
 * Wholesale-only products are hidden for non-authorised users.
 */
export async function getVisibleProductsByCategory(
  repo: ProductRepository,
  categoryId: string,
  isWholesaler: boolean
): Promise<Product[]> {
  const all = await repo.findByCategory(categoryId);
  return filterProductsByRole(all, isWholesaler);
}
