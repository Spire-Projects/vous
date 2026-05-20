import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";

export async function setLandingSectionProducts(
  repo: LandingSectionRepository,
  id: string,
  productIds: string[]
): Promise<void> {
  return repo.setProducts(id, productIds);
}
