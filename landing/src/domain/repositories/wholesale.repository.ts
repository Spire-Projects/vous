import type { WholesaleRequest } from "@/domain/entities/wholesale.entity";

export interface WholesaleRepository {
  submit(request: Omit<WholesaleRequest, "id" | "status" | "createdAt">): Promise<void>;
}
