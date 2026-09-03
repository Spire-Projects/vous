import type { WholesaleRequest, ReviewWholesaleInput } from "@/domain/entities/wholesale.entity";

export interface WholesaleRepository {
  findAll(): Promise<WholesaleRequest[]>;
  findByStatus(status: WholesaleRequest["status"]): Promise<WholesaleRequest[]>;
  review(input: ReviewWholesaleInput): Promise<void>;
}
