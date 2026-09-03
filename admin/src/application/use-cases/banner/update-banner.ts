import type { BannerRepository } from "@/domain/repositories/banner.repository";
import type { UpdateBannerInput } from "@/domain/entities/banner.entity";

export async function updateBanner(repo: BannerRepository, id: string, input: UpdateBannerInput): Promise<void> {
  return repo.update(id, input);
}
