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
 * If the item has a variantId, checks the variant's stock.
 * Otherwise falls back to the product-level stock.
 * Returns items with insufficient stock (empty array = all OK).
 */
export async function validateStock(
  repo: ProductRepository,
  items: CartItem[]
): Promise<OutOfStockItem[]> {
  const results = await Promise.all(
    items.map(async (item): Promise<OutOfStockItem | null> => {
      if (item.variantId) {
        const variants = await repo.findVariants(item.productId);
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          return {
            productId: item.productId,
            productName: item.name,
            requested: item.quantity,
            available: variant?.stock ?? 0,
          };
        }
        return null;
      }
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
