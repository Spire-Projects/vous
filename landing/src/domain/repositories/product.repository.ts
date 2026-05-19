import type { Product, ProductVariant } from "@/domain/entities/product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findVariants(productId: string): Promise<ProductVariant[]>;
  decrementVariantStock(productId: string, variantId: string, quantity: number): Promise<void>;
}
