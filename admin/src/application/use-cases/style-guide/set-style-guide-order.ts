import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";

export async function setStyleGuideOrder(repo: StyleGuideRepository, id: string, order: number) {
  return repo.setOrder(id, order);
}
