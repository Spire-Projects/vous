import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { CartItem } from "@/types/cart.types";

export interface OutOfStockItem {
  productId: string;
  productName: string;
  requested: number;
  available: number;
}

/**
 * Checks stock availability for all cart items.
 * Returns a list of items that have insufficient stock.
 * Empty array means all items are available.
 */
export async function validateStock(
  repo: ProductRepository,
  items: CartItem[]
): Promise<OutOfStockItem[]> {
  const results = await Promise.all(
    items.map(async (item) => {
      const product = await repo.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return {
          productId: item.productId,
          productName: item.name,
          requested: item.quantity,
          available: product?.stock ?? 0,
        };
      }
      return null;
    })
  );
  return results.filter((r): r is OutOfStockItem => r !== null);
}
