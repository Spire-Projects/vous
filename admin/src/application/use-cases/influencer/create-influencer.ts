import type { InfluencerRepository } from "@/domain/repositories/influencer.repository";
import type { Influencer, CreateInfluencerInput } from "@/domain/entities/influencer.entity";

export async function createInfluencer(
  repo: InfluencerRepository,
  input: CreateInfluencerInput
): Promise<Influencer> {
  return repo.create(input);
}
