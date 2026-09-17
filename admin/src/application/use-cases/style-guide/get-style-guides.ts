import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";

export async function getStyleGuides(repo: StyleGuideRepository) {
  return repo.findAll();
}
