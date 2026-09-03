import type { BannerRepository } from "@/domain/repositories/banner.repository";
import type { Banner } from "@/domain/entities/banner.entity";

export async function getBanners(repo: BannerRepository): Promise<Banner[]> {
  return repo.findAll();
}
