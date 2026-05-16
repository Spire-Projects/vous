import type { BannerRepository } from "@/domain/repositories/banner.repository";
import type { Banner, CreateBannerInput } from "@/domain/entities/banner.entity";

export async function createBanner(repo: BannerRepository, input: CreateBannerInput): Promise<Banner> {
  return repo.create(input);
}
