import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";

export async function deleteStyleGuide(repo: StyleGuideRepository, id: string) {
  return repo.delete(id);
}
