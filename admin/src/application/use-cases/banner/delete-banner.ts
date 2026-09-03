import type { BannerRepository } from "@/domain/repositories/banner.repository";

export async function deleteBanner(repo: BannerRepository, id: string): Promise<void> {
  return repo.delete(id);
}
