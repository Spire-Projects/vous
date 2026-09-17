import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";
import type { CreateLandingSectionInput, LandingSection } from "@/domain/entities/landing-section.entity";

export async function createLandingSection(
  repo: LandingSectionRepository,
  input: CreateLandingSectionInput
): Promise<LandingSection> {
  return repo.create(input);
}
