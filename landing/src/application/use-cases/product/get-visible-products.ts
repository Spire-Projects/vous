import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";
import { filterProductsByRole } from "./filter-products-by-role";

/**
 * Returns the full catalog filtered by the user's role.
 * Wholesale-only products are hidden for non-authorised users.
 */
export async function getVisibleProducts(
  repo: ProductRepository,
  isWholesaler: boolean
): Promise<Product[]> {
  const all = await repo.findAll();
  return filterProductsByRole(all, isWholesaler);
}
