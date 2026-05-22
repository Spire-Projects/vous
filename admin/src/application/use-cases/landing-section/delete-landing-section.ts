import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";

export async function deleteLandingSection(
  repo: LandingSectionRepository,
  id: string
): Promise<void> {
  return repo.delete(id);
}
