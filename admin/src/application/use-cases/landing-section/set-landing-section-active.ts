import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";

export async function setLandingSectionActive(
  repo: LandingSectionRepository,
  id: string,
  active: boolean
): Promise<void> {
  return repo.setActive(id, active);
}
