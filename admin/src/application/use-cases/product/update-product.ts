import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { UpdateProductInput } from "@/domain/entities/product.entity";

export async function updateProduct(repo: ProductRepository, id: string, input: UpdateProductInput): Promise<void> {
  return repo.update(id, input);
}
