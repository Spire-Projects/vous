import type { BannerRepository } from "@/domain/repositories/banner.repository";

export async function setBannerOrder(repo: BannerRepository, id: string, order: number): Promise<void> {
  return repo.updateOrder(id, order);
}
