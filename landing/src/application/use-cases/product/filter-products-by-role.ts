import type { Product } from "@/domain/entities/product.entity";

/**
 * Filters a product list so non-wholesalers cannot see wholesale-only items.
 */
export function filterProductsByRole(products: Product[], isWholesaler: boolean): Product[] {
  if (isWholesaler) return products;
  return products.filter((p) => !p.wholesaleOnly);
}
