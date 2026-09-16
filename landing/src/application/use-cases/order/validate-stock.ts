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
 * Verifies active state, individual quantities and cumulative quantities
 * across items sharing the same productId.
 * Returns a list of items that have insufficient stock.
 */
export async function validateStock(
  repo: ProductRepository,
  items: CartItem[]
): Promise<OutOfStockItem[]> {
  if (items.length === 0) return [];

  // Fetch unique products once
  const uniqueProductIds = Array.from(new Set(items.map((i) => i.productId)));
  const products = await Promise.all(
    uniqueProductIds.map(async (id) => ({
      id,
      product: await repo.findById(id),
    }))
  );
  const productMap = new Map(products.map((p) => [p.id, p.product]));

  const outOfStock: OutOfStockItem[] = [];
  const allocatedStock = new Map<string, number>();

  for (const item of items) {
    const product = productMap.get(item.productId);
    const effectiveStock = product && product.isActive ? Math.max(0, product.stock) : 0;
    const currentlyAllocated = allocatedStock.get(item.productId) ?? 0;
    const availableForThisItem = Math.max(0, effectiveStock - currentlyAllocated);

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
      item.productId,
      currentlyAllocated + Math.min(item.quantity, availableForThisItem)
    );
  }

  return outOfStock;
}
