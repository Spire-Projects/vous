import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";
import type { LandingSection } from "@/domain/entities/landing-section.entity";

export async function getLandingSections(repo: LandingSectionRepository): Promise<LandingSection[]> {
  return repo.findAll();
}
