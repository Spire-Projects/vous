import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function setProductActive(
  repo: ProductRepository,
  id: string,
  isActive: boolean
): Promise<void> {
  return repo.setActive(id, isActive);
}
