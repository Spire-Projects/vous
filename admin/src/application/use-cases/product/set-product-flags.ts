import type { ProductRepository, ProductFlags } from "@/domain/repositories/product.repository";

export async function setProductFlags(
  repo: ProductRepository,
  id: string,
  flags: ProductFlags
): Promise<void> {
  return repo.setFlags(id, flags);
}
