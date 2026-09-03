import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function setProductOrder(
  repo: ProductRepository,
  items: { id: string; sortOrder: number }[]
): Promise<void> {
  return repo.updateOrder(items);
}
