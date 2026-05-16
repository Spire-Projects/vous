import type { Product, CreateProductInput, UpdateProductInput } from "@/domain/entities/product.entity";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
}
