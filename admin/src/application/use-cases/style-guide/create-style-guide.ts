import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";
import type { CreateStyleGuideInput } from "@/domain/entities/style-guide.entity";

export async function createStyleGuide(repo: StyleGuideRepository, input: CreateStyleGuideInput) {
  return repo.create(input);
}
