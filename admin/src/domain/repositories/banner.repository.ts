import type { Banner, CreateBannerInput, UpdateBannerInput } from "@/domain/entities/banner.entity";

export interface BannerRepository {
  findAll(): Promise<Banner[]>;
  findById(id: string): Promise<Banner | null>;
  create(input: CreateBannerInput): Promise<Banner>;
  update(id: string, input: UpdateBannerInput): Promise<void>;
  delete(id: string): Promise<void>;
  setActive(id: string, active: boolean): Promise<void>;
  updateOrder(id: string, order: number): Promise<void>;
}
