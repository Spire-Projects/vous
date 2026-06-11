import type { InfluencerRepository } from "@/domain/repositories/influencer.repository";
import type { Influencer } from "@/domain/entities/influencer.entity";

export async function getAllInfluencers(repo: InfluencerRepository): Promise<Influencer[]> {
  return repo.getAll();
}
