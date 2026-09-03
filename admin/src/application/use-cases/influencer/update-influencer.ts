import type { InfluencerRepository } from "@/domain/repositories/influencer.repository";
import type { UpdateInfluencerInput } from "@/domain/entities/influencer.entity";

export async function updateInfluencer(
  repo: InfluencerRepository,
  id: string,
  input: UpdateInfluencerInput
): Promise<void> {
  return repo.update(id, input);
}
