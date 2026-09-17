import type {
  LandingSectionRepository,
  LandingSectionWithProducts,
} from "@/domain/repositories/landing-section.repository";

export async function getActiveLandingSections(
  repo: LandingSectionRepository
): Promise<LandingSectionWithProducts[]> {
  return repo.findActiveWithProducts();
}
