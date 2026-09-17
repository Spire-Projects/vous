import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";
import type { UpdateStyleGuideInput } from "@/domain/entities/style-guide.entity";

export async function updateStyleGuide(repo: StyleGuideRepository, id: string, input: UpdateStyleGuideInput) {
  return repo.update(id, input);
}
