import type { CategoryRepository } from "@/domain/repositories/category.repository";
import type { Category } from "@/domain/entities/category.entity";

export async function getCategories(repo: CategoryRepository): Promise<Category[]> {
  return repo.findAll();
}
