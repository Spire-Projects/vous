import type { ProductRepository } from "@/domain/repositories/product.repository";

export async function deleteProduct(repo: ProductRepository, id: string): Promise<void> {
  await repo.delete(id);
}
