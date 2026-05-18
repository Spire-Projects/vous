import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product, CreateProductInput } from "@/domain/entities/product.entity";

export async function createProduct(repo: ProductRepository, input: CreateProductInput): Promise<Product> {
  return repo.create(input);
}
