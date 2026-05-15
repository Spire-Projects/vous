import type { Product } from "@/domain/entities/product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  update(id: string, data: Partial<Product>): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
}
