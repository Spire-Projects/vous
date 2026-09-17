import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { CartItem } from "@/types/cart.types";

export interface OutOfStockItem {
  id: string;
  productId: string;
  productName: string;
  variantDescription?: string;
  requested: number;
  available: number;
}

/**
 * Checks stock availability for all cart items.
 * Supports both variant-level stock and product-level stock with cumulative allocation.
 * Returns items with insufficient stock (empty array = all OK).
 */
export async function validateStock(
  repo: ProductRepository,
  items: CartItem[]
): Promise<OutOfStockItem[]> {
  if (items.length === 0) return [];

  // Fetch unique products and variants once to avoid N+1 queries
  const uniqueProductIds = [...new Set(items.map((i) => i.productId))];
  const products = await Promise.all(
    uniqueProductIds.map(async (id) => ({
      id,
      product: await repo.findById(id),
      variants: await repo.findVariants(id),
    }))
  );
  const productMap = new Map(products.map((p) => [p.id, p]));

  const outOfStock: OutOfStockItem[] = [];
  const allocatedStock = new Map<string, number>();

  for (const item of items) {
    const entry = productMap.get(item.productId);
    const product = entry?.product;
    const isProductActive = product ? product.isActive : false;

    let totalAvailable = 0;
    const stockKey = item.variantId ? `var_${item.variantId}` : `prod_${item.productId}`;

    if (item.variantId) {
      const variant = entry?.variants.find((v) => v.id === item.variantId);
      totalAvailable = variant && isProductActive ? Math.max(0, variant.stock) : 0;
    } else {
      totalAvailable = product && isProductActive ? Math.max(0, product.stock) : 0;
    }

    const currentlyAllocated = allocatedStock.get(stockKey) ?? 0;
    const availableForThisItem = Math.max(0, totalAvailable - currentlyAllocated);

    if (availableForThisItem < item.quantity) {
      const variantParts = [item.size, item.color].filter(Boolean);
      outOfStock.push({
        id: item.id,
        productId: item.productId,
        productName: item.name,
        variantDescription: variantParts.length > 0 ? variantParts.join(" / ") : undefined,
        requested: item.quantity,
        available: availableForThisItem,
      });
    }

    allocatedStock.set(
      stockKey,
      currentlyAllocated + Math.min(item.quantity, availableForThisItem)
    );
  }

  return outOfStock;
}
