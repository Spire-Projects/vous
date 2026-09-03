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
  const variantItems = items.filter((i) => i.variantId);
  const simpleItems = items.filter((i) => !i.variantId);

  // Fetch variants once per unique product to avoid N+1 Firestore reads
  const uniqueProductIds = [...new Set(variantItems.map((i) => i.productId))];
  const variantsByProductId = new Map<string, Awaited<ReturnType<typeof repo.findVariants>>>();
  await Promise.all(
    uniqueProductIds.map(async (productId) => {
      variantsByProductId.set(productId, await repo.findVariants(productId));
    })
  );

  const results = await Promise.all([
    ...variantItems.map(async (item): Promise<OutOfStockItem | null> => {
      const variants = variantsByProductId.get(item.productId) ?? [];
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
    }),
    ...simpleItems.map(async (item): Promise<OutOfStockItem | null> => {
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
    }),
  ]);

  return results.filter((r): r is OutOfStockItem => r !== null);
}
