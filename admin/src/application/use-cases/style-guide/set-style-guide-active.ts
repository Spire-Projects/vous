import type { StyleGuideRepository } from "@/domain/repositories/style-guide.repository";

export async function setStyleGuideActive(repo: StyleGuideRepository, id: string, active: boolean) {
  return repo.setActive(id, active);
}
