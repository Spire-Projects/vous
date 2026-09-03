import type { Banner } from "@/domain/entities/banner.entity";

export interface BannerRepository {
  findActive(): Promise<Banner[]>;
}
