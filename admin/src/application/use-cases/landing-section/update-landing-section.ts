import type { LandingSectionRepository } from "@/domain/repositories/landing-section.repository";
import type { UpdateLandingSectionInput } from "@/domain/entities/landing-section.entity";

export async function updateLandingSection(
  repo: LandingSectionRepository,
  id: string,
  input: UpdateLandingSectionInput
): Promise<void> {
  return repo.update(id, input);
}
