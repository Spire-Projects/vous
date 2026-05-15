import type { ProductRepository } from "@/domain/repositories/product.repository";
import type { Product } from "@/domain/entities/product.entity";

export async function getProducts(repo: ProductRepository): Promise<Product[]> {
  return repo.findAll();
}
