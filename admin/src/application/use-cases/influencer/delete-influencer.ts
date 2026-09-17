import type { InfluencerRepository } from "@/domain/repositories/influencer.repository";

export async function deleteInfluencer(repo: InfluencerRepository, id: string): Promise<void> {
  return repo.delete(id);
}
