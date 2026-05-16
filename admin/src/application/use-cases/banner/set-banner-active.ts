import type { BannerRepository } from "@/domain/repositories/banner.repository";

export async function setBannerActive(repo: BannerRepository, id: string, active: boolean): Promise<void> {
  return repo.setActive(id, active);
}
