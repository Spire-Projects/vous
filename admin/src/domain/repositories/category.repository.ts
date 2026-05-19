import type { Category, CreateCategoryInput } from "@/domain/entities/category.entity";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  save(data: CreateCategoryInput): Promise<Category>;
  update(id: string, data: Partial<CreateCategoryInput>): Promise<void>;
  remove(id: string): Promise<void>;
  updateOrder(items: { id: string; sortOrder: number }[]): Promise<void>;
}
