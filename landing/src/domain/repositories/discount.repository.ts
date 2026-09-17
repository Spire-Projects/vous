import type { Discount } from "@/domain/entities/discount.entity";

export interface DiscountRepository {
  findByCode(code: string): Promise<Discount | null>;
}
