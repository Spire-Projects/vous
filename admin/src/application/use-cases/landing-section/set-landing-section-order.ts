import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";

export async function setLandingSectionOrder(
  repo: LandingSectionRepository,
  id: string,
  order: number
): Promise<void> {
  return repo.updateOrder(id, order);
}
